<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Filter\CustomerNameOrCompanyFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups as SerializerGroups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 * @ApiResource(
 *     normalizationContext={
 *          "groups"={"customer_read"}
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"firstName": "start", "lastName": "start", "company": "start"})
 * @ApiFilter(OrderFilter::class)
 * @ApiFilter(CustomerNameOrCompanyFilter::class, strategy="start")
 */
class Customer
{
    /**
     * @var int
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @SerializerGroups({"customer_read", "invoice_read"})
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @SerializerGroups({"customer_read", "invoice_read"})
     * @Assert\Length(
     *      min = 2,
     *      max = 255,
     *      minMessage = "form_errors.global.min_length",
     *      maxMessage = "form_errors.global.max_length",
     * )
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $firstName;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @SerializerGroups({"customer_read", "invoice_read"})
     * @Assert\Length(
     *      min = 2,
     *      max = 255,
     *      minMessage = "form_errors.global.min_length",
     *      maxMessage = "form_errors.global.max_length",
     * )
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $lastName;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255)
     * @SerializerGroups({"customer_read", "invoice_read"})
     * @Assert\Email(message = "form_errors.user.valid_email")
     * @Assert\Length(
     *      min = 2,
     *      max = 255,
     *      minMessage = "form_errors.global.min_length",
     *      maxMessage = "form_errors.global.max_length",
     * )
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $email;

    /**
     * @var string|null
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @SerializerGroups({"customer_read", "invoice_read"})
     * @Assert\Length(
     *      min = 2,
     *      max = 255,
     *      minMessage = "form_errors.global.min_length",
     *      maxMessage = "form_errors.global.max_length",
     * )
     */
    private $company;

    /**
     * @var Collection|Invoice[]
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="customer", orphanRemoval=true)
     * @SerializerGroups({"customer_read"})
     * @ApiSubresource()
     */
    private $invoices;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
     * @ORM\JoinColumn(nullable=false)
     * @SerializerGroups({"customer_read"})
     * @Assert\NotBlank(message="form_errors.global.not_blank")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * @SerializerGroups({"customer_read"})
     * @return float
     */
    public function getPaidAmount(): float
    {
        return round(
            array_reduce(
                $this->invoices->toArray(),
                function (float $total, Invoice $invoice): float {
                    if ($invoice->getStatus() === 'PAID') {
                        $total += $invoice->getAmount();
                    }

                    return $total;
                }, 0
            ),
            2);
    }

    /**
     * @SerializerGroups({"customer_read"})
     * @return float
     */
    public function getTotalAmount(): float
    {
        return round(
            array_reduce(
                $this->invoices->toArray(),
                function (float $total, Invoice $invoice): float {
                    return $total + $invoice->getAmount();
                }, 0
            ),
            2);
    }

    /**
     * @SerializerGroups({"customer_read"})
     * @return float
     */
    public function getUnpaidAmount(): float
    {
        return round(
            array_reduce(
                $this->invoices->toArray(),
                function (float $total, Invoice $invoice): float {
                    if ($invoice->getStatus() === 'SENT') {
                        $total += $invoice->getAmount();
                    }

                    return $total;
                }, 0
            ),
            2);
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     * @return $this
     */
    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     * @return $this
     */
    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return $this
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCompany(): ?string
    {
        return $this->company;
    }

    /**
     * @param string|null $company
     * @return $this
     */
    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User $user
     * @return $this
     */
    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
