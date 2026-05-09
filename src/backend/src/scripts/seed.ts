import { createUser, findUserByEmailWithPassword } from '../repositories/userRepository';
import { createProperty, listProperties } from '../repositories/propertyRepository';
import { migrateDatabase } from '../db/migrate';
import { hashPassword } from '../utils/password';

const run = async (): Promise<void> => {
  await migrateDatabase();

  const ownerEmail = 'owner@example.com';
  const flipperEmail = 'flipper@example.com';

  let owner = await findUserByEmailWithPassword(ownerEmail);
  if (!owner) {
    owner = {
      ...(await createUser({
        email: ownerEmail,
        passwordHash: await hashPassword('Password123!'),
        name: 'Sample Owner',
        userType: 'OWNER',
        companyName: 'Fixer Homes LLC',
        taxId: 'TAX-12345',
      })),
      passwordHash: '',
    };
  }

  let flipper = await findUserByEmailWithPassword(flipperEmail);
  if (!flipper) {
    flipper = {
      ...(await createUser({
        email: flipperEmail,
        passwordHash: await hashPassword('Password123!'),
        name: 'Sample Flipper',
        userType: 'FLIPPER',
        specializations: ['single-family', 'multi-family'],
        portfolioProjects: 12,
      })),
      passwordHash: '',
    };
  }

  const existingPropertyCount = await listProperties({ page: 1, limit: 1, ownerId: owner.id });

  if (existingPropertyCount.items.length === 0) {
    await createProperty(
      {
        ownerId: owner.id,
        title: 'Distressed Duplex Near Downtown',
        description:
          'A duplex with strong upside for investors willing to renovate kitchens, baths, and exterior landscaping.',
        address: '123 Market Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        propertyType: 'multi-family',
        condition: 'needs-work',
        askingPrice: 245000,
        squareFootage: 2400,
        yearBuilt: 1978,
        latitude: 30.2672,
        longitude: -97.7431,
      },
      [],
    );
  }

  console.log('Seed complete. Sample accounts:');
  console.log(`- Owner: ${ownerEmail} / Password123!`);
  console.log(`- Flipper: ${flipperEmail} / Password123!`);
};

run().catch((error) => {
  console.error('Seed failed.', error);
  process.exit(1);
});
