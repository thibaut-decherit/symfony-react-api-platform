<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use DateTime;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\ORM\NonUniqueResultException;
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
                ['onCustomerPostSetUser', EventPriorities::PRE_VALIDATE],
                ['onInvoicePost', EventPriorities::PRE_VALIDATE],
                ['onUserPostHashPassword', EventPriorities::PRE_WRITE]
            ]
        ];
    }

    /**
     * @param ViewEvent $event
     */
    public function onCustomerPostSetUser(ViewEvent $event): void
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
     * Sets chrono and sentAt of Invoice before persistence to database.
     *
     * @param ViewEvent $event
     * @throws NonUniqueResultException
     */
    public function onInvoicePost(ViewEvent $event): void
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

        $chrono = $this->objectManager->getRepository(Invoice::class)->getNextChrono($user);

        /**
         * @var Invoice $invoice
         */
        $invoice = $result;

        $invoice->setChrono($chrono);
        $invoice->setSentAt(new DateTime());
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