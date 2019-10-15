<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

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
     * KernelViewSubscriber constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        // See https://api-platform.com/docs/core/events/#the-event-system for priorities.
        return [
            KernelEvents::VIEW => [
                ['hashPassword', EventPriorities::PRE_WRITE]
            ]
        ];
    }

    /**
     * Hash password of User before persistence in database.
     *
     * @param ViewEvent $event
     */
    public function hashPassword(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof User !== false && $method !== 'POST') {
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