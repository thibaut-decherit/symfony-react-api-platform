<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use App\Entity\User;
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
     * KernelViewSubscriber constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param Security $security
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder, Security $security)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->security = $security;
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
     * Hashes password of User before persistence in database.
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