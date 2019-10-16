<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups as SerializerGroups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 * @ApiResource(
 *     attributes={
 *          "pagination_enabled"=true,
 *          "pagination_items_per_page"=20,
 *          "order"={"sentAt"="desc"},
 *     },
 *     normalizationContext={
 *          "groups"={"invoice_read"}
 *     },
 *     subresourceOperations={
 *          "api_customers_invoices_read_subresource"={
 *              "normalization_context"={
 *                  "groups"={"invoice_read_as_subresource"}
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
     * @SerializerGroups({"invoice_read", "customer_read", "invoice_read_as_subresource"})
     */
    private $id;

    /**
     * @var float
     *
     * @ORM\Column(type="float")
     * @SerializerGroups({"invoice_read", "customer_read", "invoice_read_as_subresource"})
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     * @Assert\PositiveOrZero()
     */
    private $amount;

    /**
     * @var DateTime
     *
     * @ORM\Column(type="datetime")
     * @SerializerGroups({"invoice_read", "customer_read", "invoice_read_as_subresource"})
     * @Assert\DateTime(message="form_errors.global.valid_date")
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $sentAt;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @SerializerGroups({"invoice_read", "customer_read", "invoice_read_as_subresource"})
     * @Assert\Choice({"SENT", "CANCELLED", "PAID"})
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $status;

    /**
     * @var Customer
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @SerializerGroups({"invoice_read", "invoice_read_as_subresource"})
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $customer;

    /**
     * @var int|null
     *
     * @ORM\Column(type="integer", nullable=true)
     * @SerializerGroups({"invoice_read", "customer_read", "invoice_read_as_subresource"})
     */
    private $chrono;

    /**
     * @SerializerGroups({"invoice_read", "invoice_read_as_subresource"})
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
     * @param Customer $customer
     * @return $this
     */
    public function setCustomer(Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    /**
     * @param int|null $chrono
     * @return $this
     */
    public function setChrono(?int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
