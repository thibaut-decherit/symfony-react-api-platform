<?php

namespace App\Repository;

use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\NonUniqueResultException;

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
     * @param Invoice $invoice
     * @return mixed
     * @throws DBALException
     */
    public function setIncrementedChrono(Invoice $invoice, User $user)
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
                WHERE i.id = :invoiceId
            ";

        return $this->em
            ->getConnection()->prepare($query)
            ->execute([
                'invoiceId' => $invoice->getId(),
                'userId' => $user->getId()
            ]);
    }

    /**
     * @param Invoice $invoice
     * @param User $user
     * @return mixed
     * @throws NonUniqueResultException
     */
    public function esetIncrementedChrono(Invoice $invoice, User $user)
    {
        return $this
            ->createQueryBuilder('i')
            ->update()
            ->set(
                'i.chrono',
                // Gets highest chrono for this user + 1.
                $this
                    ->createQueryBuilder('i')
                    ->select('i.chrono')
                    ->join('i.customer', 'c')
                    ->where('c.user = :user')
                    ->setParameter('user', $user)
                    ->orderBy('i.chrono', 'DESC')
                    ->setMaxResults(1)
                    ->getQuery()
                    ->getSingleScalarResult() + 1
            )
            ->where('i.id = :invoice')
            ->setParameter('invoice', $invoice)
            ->getQuery()
            ->execute();
    }
}
