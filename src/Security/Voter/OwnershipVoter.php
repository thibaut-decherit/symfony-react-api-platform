<?php

namespace App\Security\Voter;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Exception;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * Class ProjectVoter
 *
 * SUPPORTED_ATTRIBUTES, SUPPORTED_SUBJECTS, DIRECT_OWNERSHIP_RELATION and voteOnAttribute() switch must be edited to
 * include entities you need to verify.
 *
 * @package App\Security\Voter
 */
class OwnershipVoter extends Voter
{
    // Attributes supported by this voter.
    const SUPPORTED_ATTRIBUTES = [
        'ownership' => 'OWNERSHIP',
    ];

    // Subjects supported by this voter.
    const SUPPORTED_SUBJECTS = [
        'customer' => Customer::class,
        'invoice' => Invoice::class,
    ];

    // Subjects with getUser() method.
    const DIRECT_OWNERSHIP_RELATION = [
        'customer' => Customer::class,
    ];

    /**
     * Decides if this voter is concerned by a specific isGranted() / denyAccessUnlessGranted() call.
     *
     * @param string $attribute
     * @param mixed $subject
     * @return bool
     * @throws Exception
     */
    protected function supports($attribute, $subject): bool
    {
        // Checks if attribute is supported by this voter.
        if (!in_array($attribute, self::SUPPORTED_ATTRIBUTES)) {
            return false;
        }

        // Checks if subject is supported by this voter.
        if (!in_array(get_class($subject), self::SUPPORTED_SUBJECTS)) {
            throw new Exception(get_class($subject) . ' is not a supported subject, try to add it to the SUPPORTED_SUBJECTS constant');
        }

        return true;
    }

    /**
     * Vote logic if $this->supports() returns true.
     *
     * @param string $attribute
     * @param mixed $subject
     * @param TokenInterface $token
     * @return bool
     * @throws Exception
     */
    protected function voteOnAttribute($attribute, $subject, TokenInterface $token): bool
    {
        $currentUser = $token->getUser();

        // User must be authenticated.
        if (!$currentUser instanceof User) {
            return false;
        }

        // IF subject has getUser() method.
        if (in_array(get_class($subject), self::DIRECT_OWNERSHIP_RELATION)) {
            return $this->hasOwnership($subject, $currentUser);
        }

        /*
         * IF subject doesn't have getUser() method then a parent entity with getUser() method must be specified
         * in the switch below.
         */
        $supportedSubjects = self::SUPPORTED_SUBJECTS;

        switch (get_class($subject)) {
            // Invoice doesn't have getUser() method but parent entity Customer does.
            case $supportedSubjects['invoice']:
                /**
                 * @var Invoice $subject
                 */
                return $this->hasOwnership($subject->getCustomer(), $currentUser);
                break;
        }

        throw new Exception('Could not find getUser() method in ' . get_class($subject) . '. Try to find a relation with getUser() method.');
    }

    /**
     * Checks if subject is owned by current user.
     *
     * @param $subject
     * @param User $currentUser
     * @return bool
     */
    private function hasOwnership($subject, User $currentUser): bool
    {
        return $subject->getUser()->getId() === $currentUser->getId();
    }
}
