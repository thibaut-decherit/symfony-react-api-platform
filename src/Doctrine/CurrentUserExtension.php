<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

/**
 * Class CurrentUserExtension
 * @package App\Doctrine
 *
 * Adds user = currentUser parameter to Customer and Invoice queries so users cannot make any read or write query to a
 * Customer or Invoice entity they don't own.
 *
 * API Platform will return 404 response if the targeted resource is not owned by the current user (e.g. PUT at
 * api/invoices/14627 but Invoice 14627 is not owned by current user)
 * API Platform will return 400 response if the reference of a key in the query's body is not owned by the current user
 * (e.g. Invoice POST with key "customer": "api/customers/2864" but Customer 2864 is not owned by current user)
 */
class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    /**
     * @var Security
     */
    private $security;

    /**
     * CurrentUserExtension constructor.
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @param string $resourceClass
     * @return bool
     */
    private function supports(string $resourceClass): bool
    {
        $supportedClasses = [
            Customer::class,
            Invoice::class
        ];

        return in_array($resourceClass, $supportedClasses);
    }

    /**
     * @param string $resourceClass
     * @param QueryBuilder $queryBuilder
     */
    private function addWhereCurrentUser(string $resourceClass, QueryBuilder $queryBuilder): void
    {
        $rootAlias = $queryBuilder->getRootAliases()[0];

        if ($resourceClass === Customer::class) {
            $queryBuilder->andWhere("$rootAlias.user = :user");
        } elseif ($resourceClass === Invoice::class) {
            $queryBuilder
                ->join("$rootAlias.customer", 'customer')
                ->andWhere('customer.user = :user');
        }

        $queryBuilder->setParameter('user', $this->security->getUser());
    }

    /**
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     */
    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ): void
    {
        if (!$this->supports($resourceClass)) {
            return;
        }

        $this->addWhereCurrentUser($resourceClass, $queryBuilder);
    }

    /**
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param array $identifiers
     * @param string|null $operationName
     * @param array $context
     */
    public function applyToItem(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        array $identifiers,
        string $operationName = null,
        array $context = []
    ): void
    {
        if (!$this->supports($resourceClass)) {
            return;
        }

        $this->addWhereCurrentUser($resourceClass, $queryBuilder);
    }
}