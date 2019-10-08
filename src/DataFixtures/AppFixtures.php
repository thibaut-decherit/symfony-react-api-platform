<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Exception;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    /**
     * @var int
     */
    private $chrono;

    /**
     * AppFixtures constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->chrono = 0;
    }

    /**
     * @param ObjectManager $manager
     * @throws Exception
     */
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($u = 0; $u < 30; $u++) {
            $user = new User();
            $user
                ->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($this->passwordEncoder->encodePassword($user, 'password'));

            $manager->persist($user);
            $manager->flush();

            $this->setChrono(1);

            for ($c = 0; $c < random_int(5, 20); $c++) {
                $this->generateCustomer($manager, $faker, $user);
            }
        }
    }

    /**
     * @param ObjectManager $manager
     * @param Generator $faker
     * @param User $user
     * @throws Exception
     */
    private function generateCustomer(ObjectManager $manager, Generator $faker, User $user)
    {
        $customer = new Customer();
        $customer
            ->setFirstName($faker->firstName)
            ->setLastName($faker->lastName)
            ->setEmail($faker->email)
            ->setUser($user);

        $manager->persist($customer);
        $manager->flush();

        for ($i = 0; $i < random_int(3, 10); $i++) {
            $this->generateInvoice($manager, $faker, $customer);
        }
    }

    /**
     * @param ObjectManager $manager
     * @param Generator $faker
     * @param Customer $customer
     */
    private function generateInvoice(ObjectManager $manager, Generator $faker, Customer $customer): void
    {
        $chrono = $this->getChrono();

        $invoice = new Invoice();
        $invoice
            ->setAmount($faker->randomFloat(2, 250, 5000))
            ->setSentAt($faker->dateTimeBetween('-6 months'))
            ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
            ->setCustomer($customer)
            ->setChrono($chrono);

        $this->setChrono($chrono + 1);

        $manager->persist($invoice);
    }

    /**
     * @return int
     */
    public function getChrono(): int
    {
        return $this->chrono;
    }

    /**
     * @param int $chrono
     * @return AppFixtures
     */
    public function setChrono(int $chrono): AppFixtures
    {
        $this->chrono = $chrono;

        return $this;
    }
}
