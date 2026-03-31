import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(54321)

export const virtualScenes = Array.from({ length: 6 }, (_, index) => {
  const now = new Date()
  const createdDate = faker.date.past({ years: 1, refDate: now })
  const updatedDate = faker.date.recent({ days: 30, refDate: now })

  return {
    id: index + 1,
    name: faker.commerce.productName(),
    url: faker.internet.url(),
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
  }
})
