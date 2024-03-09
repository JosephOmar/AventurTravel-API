import z from 'zod'

const destinationsSchema = z.object({
  tourOption: z.string(),
  slug: z.string(),
  title: z.string(),
  name: z.string(),
  imgSlider: z.array(z.string().url()),
  description: z.string(),
  timeTravel: z.string(),
  itinerary: z.array(z.string()),
  considerations: z.array(z.string()),
  additional: z.array(z.string()),
  price: z.number().int().positive(),
  imgCarousel: z.array(z.string().url()),
  comments: z.array(z.object({
    img: z.string().url(),
    name: z.string(),
    description: z.string()
  }))
})

export function validateDestination (object) {
  return destinationsSchema.safeParse(object)
}

export function validatePartialDestination (object) {
  return destinationsSchema.partial().safeParse(object)
}
