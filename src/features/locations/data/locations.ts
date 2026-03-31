import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(54321)

export const locations = Array.from({ length: 8 }, (_, index) => {
  const now = new Date()
  const createdDate = faker.date.past({ years: 1, refDate: now })
  const updatedDate = faker.date.recent({ days: 30, refDate: now })

  return {
    id: index + 1,
    name: faker.location.city(),
    media_id: faker.datatype.boolean()
      ? faker.number.int({ min: 1, max: 100 })
      : null,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
  }
})
