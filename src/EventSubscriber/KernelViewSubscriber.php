<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use DateTime;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\NonUniqueResultException;
use Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Class KernelViewSubscriber
 * @package App\EventSubscriber
 */
class KernelViewSubscriber implements EventSubscriberInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    /**
     * @var Security
     */
    private $security;

    /**
     * @var ObjectManager
     */
    private $objectManager;

    /**
     * KernelViewSubscriber constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param Security $security
     * @param ObjectManager $objectManager
     */
    public function __construct(
        UserPasswordEncoderInterface $passwordEncoder,
        Security $security,
        ObjectManager $objectManager
    )
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->security = $security;
        $this->objectManager = $objectManager;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        // See https://api-platform.com/docs/core/events/#the-event-system for priorities.
        return [
            KernelEvents::VIEW => [
                ['onCustomerPreValidateSetUser', EventPriorities::PRE_VALIDATE],
                ['onInvoicePreValidate', EventPriorities::PRE_VALIDATE],
                ['onInvoicePostWrite', EventPriorities::POST_WRITE],
                ['onUserPostHashPassword', EventPriorities::PRE_WRITE]
            ]
        ];
    }

    /**
     * @param ViewEvent $event
     */
    public function onCustomerPreValidateSetUser(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Customer === false || $method !== 'POST') {
            return;
        }

        /**
         * @var Customer $customer
         */
        $customer = $result;

        /**
         * @var User $user
         */
        $user = $this->security->getUser();

        $customer->setUser($user);
    }

    /**
     * Sets chrono and sentAt of Invoice before model validation and persistence to database.
     *
     * @param ViewEvent $event
     * @throws Exception
     */
    public function onInvoicePreValidate(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice === false || $method !== 'POST') {
            return;
        }

        /**
         * @var Invoice $invoice
         */
        $invoice = $result;

        $invoice->setChrono(null);
        $invoice->setSentAt(new DateTime());
    }

    /**
     * Sets incremented chrono to oldest Invoice without Chrono for current User while avoiding potential chrono
     * discrepancy caused by race condition between the moment when highest chrono is read from db then set to newest
     * Invoice object and the moment when newest Invoice is written to db with highest chrono + 1: a discrepancy could
     * appear if another Invoice is created between these two moments (the same highest chrono + 1 could be set).
     * See https://stackoverflow.com/questions/24681613/doctrine-entity-increase-value-download-counter#comment95515263_24681957
     *
     * @param ViewEvent $event
     * @throws DBALException
     */
    public function onInvoicePostWrite(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice === false || $method !== 'POST') {
            return;
        }

        /**
         * @var User $user
         */
        $user = $this->security->getUser();

        $this->objectManager->getRepository(Invoice::class)->setIncrementedChrono($user);
    }

    /**
     * Hashes password of User before persistence to database.
     *
     * @param ViewEvent $event
     */
    public function onUserPostHashPassword(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof User === false || $method !== 'POST') {
            return;
        }

        /**
         * @var User $user
         */
        $user = $result;

        $user->setPassword(
            $this->passwordEncoder->encodePassword($result, $user->getPassword())
        );
    }
}