<?php

namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

/**
 * Class CustomerNameOrCompanyFilter
 * @package App\Filter
 */
class CustomerNameOrCompanyFilter extends AbstractContextAwareFilter
{
    /**
     * @param string $property
     * @param $value
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     */
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    )
    {
        if ($property !== 'nameOrCompanyStartsBy') {
            return;
        }

        $sanitizedValue = addcslashes($value, '\\%_');

        $rootAlias = $queryBuilder->getRootAliases()[0];

        // Generates a unique parameter name to avoid collisions with other filters.
        $parameterName = $queryNameGenerator->generateParameterName($property);
        $queryBuilder
            ->andWhere("$rootAlias.firstName LIKE :$parameterName")
            ->orWhere("$rootAlias.lastName LIKE :$parameterName")
            ->orWhere("$rootAlias.company LIKE :$parameterName")
            ->setParameter($parameterName, "$sanitizedValue%");
    }

    /**
     * This function is only used to hook in documentation generators (supported by Swagger and Hydra).
     *
     * @param string $resourceClass
     * @return array
     */
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description["nameOrCompanyStartsBy"] = [
                'property' => $property,
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Filter on customer first name, last name or company',
                    'name' => 'Filter on customer first name, last name or company',
                    'type' => 'Filter on customer first name, last name or company',
                ],
            ];
        }

        return $description;
    }
}
