<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *     attributes={
 *          "pagination_enabled"=true,
 *          "pagination_items_per_page"=20,
 *          "order"={"sentAt"="desc"},
 *     },
 *     normalizationContext={
 *          "groups"={"invoice_get"}
 *     },
 *     subresourceOperations={
 *          "api_customers_invoices_get_subresource"={
 *              "normalization_context"={
 *                  "groups"={"invoice_get_as_subresource"}
 *              }
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"customer.firstName": "start", "customer.lastName": "start"})
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 */
class Invoice
{
    /**
     * @var int
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoice_get", "customer_get", "invoice_get_as_subresource"})
     */
    private $id;

    /**
     * @var float
     *
     * @ORM\Column(type="float")
     * @Groups({"invoice_get", "customer_get", "invoice_get_as_subresource"})
     */
    private $amount;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime")
     * @Groups({"invoice_get", "customer_get", "invoice_get_as_subresource"})
     */
    private $sentAt;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoice_get", "customer_get", "invoice_get_as_subresource"})
     */
    private $status;

    /**
     * @var Customer
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoice_get", "invoice_get_as_subresource"})
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoice_get", "customer_get", "invoice_get_as_subresource"})
     */
    private $chrono;

    /**
     * @Groups({"invoice_get", "invoice_get_as_subresource"})
     * @return User
     */
    public function getUser(): User
    {
        return $this->getCustomer()->getUser();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return $this
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getSentAt(): ?DateTime
    {
        return $this->sentAt;
    }

    /**
     * @param DateTime $sentAt
     * @return $this
     */
    public function setSentAt(DateTime $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     * @return $this
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Customer|null
     */
    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    /**
     * @param Customer|null $customer
     * @return $this
     */
    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
