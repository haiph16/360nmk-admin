import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(98765)

export const contacts = Array.from({ length: 10 }, (_, index) => {
  const now = new Date()
  const createdDate = faker.date.past({ years: 1, refDate: now })
  const updatedDate = faker.date.recent({ days: 30, refDate: now })

  return {
    id: index + 1,
    name: faker.person.fullName(),
    address: faker.datatype.boolean() ? faker.location.streetAddress() : null,
    phone: faker.datatype.boolean() ? faker.phone.number() : null,
    website: faker.datatype.boolean() ? faker.internet.url() : null,
    hotline: faker.datatype.boolean() ? faker.phone.number() : null,
    position: faker.person.jobTitle(),
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
  }
})
