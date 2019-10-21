<?php

namespace App\Repository;

use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em)
    {
        parent::__construct($registry, Invoice::class);
        $this->em = $em;
    }

    /**
     * Sets chrono of oldest Invoice with null chrono and owned by given User.
     * Chrono is set to highest chrono in Invoices owned by given User + 1.
     *
     * @param User $user
     * @return mixed
     * @throws DBALException
     */
    public function setIncrementedChrono(User $user)
    {
        $customerTable = 'customer';
        $invoiceTable = 'invoice';

        $query = "
                UPDATE $invoiceTable AS i
                SET i.chrono = (
                    SELECT chrono
                    FROM (SELECT chrono, customer_id FROM $invoiceTable) AS i2
                    WHERE i2.customer_id IN (
                        SELECT id
                        FROM (
                            SELECT id FROM $customerTable
                            WHERE user_id = :userId
                        ) AS c
                    )
                    ORDER BY i2.chrono DESC
                    LIMIT 1
                ) + 1
                WHERE i.id = (
                    SELECT id
                    FROM (SELECT id, chrono, customer_id FROM $invoiceTable) AS i3
                    WHERE i3.chrono IS NULL
                    AND i3.customer_id IN (
                        SELECT id
                        FROM (
                            SELECT id FROM $customerTable
                            WHERE user_id = :userId
                        ) AS c2
                    )
                    ORDER BY id ASC
                    LIMIT 1
                )
            ";

        return $this->em
            ->getConnection()->prepare($query)
            ->execute([
                'userId' => $user->getId()
            ]);
    }
}
