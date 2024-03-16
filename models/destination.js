import pgPromise from 'pg-promise'
import { config } from 'dotenv'

config()

const pgp = pgPromise({})

const cliente = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export class DestinationModel {
  static async getAll ({ tourOption, slug }) {
    try {
      let queryString = `
      SELECT
          d.id,
          d.tourOption AS "tourOption",
          d.slug,
          d.title,
          d.name,
          d.imgSlider AS "imgSlider",
          d.description,
          d.timeTravel AS "timeTravel",
          d.itinerary,
          d.considerations,
          d.additional,
          d.price,
          d.imgCarousel AS "imgCarousel",
          json_agg(json_build_object(
              'img', c.img,
              'name', c.name,
              'description', c.description
          )) AS comments
      FROM destinations d
      LEFT JOIN comments c ON d.id = c.destination_id
    `

      const values = []

      if (tourOption && slug) {
        queryString += ' WHERE d.tourOption ILIKE $1 AND d.slug ILIKE $2'
        values.push(`%${tourOption}%`, `%${slug}%`)
      } else if (tourOption) {
        queryString += ' WHERE d.tourOption ILIKE $1'
        values.push(`%${tourOption}%`)
      } else if (slug) {
        queryString += ' WHERE d.slug ILIKE $1'
        values.push(`%${slug}%`)
      }

      queryString += ' GROUP BY d.id'

      const destinationsWithComments = await cliente.query(queryString, values)

      return destinationsWithComments
    } catch (error) {
      console.error('Error al obtener destinos:', error)
      throw error
    }
  }

  static async getById ({ id }) {
    try {
      const queryString = `
      SELECT
          d.id,
          d.tourOption AS "tourOption",
          d.slug,
          d.title,
          d.name,
          d.imgSlider AS "imgSlider",
          d.description,
          d.timeTravel AS "timeTravel",
          d.itinerary,
          d.considerations,
          d.additional,
          d.price,
          d.imgCarousel AS "imgCarousel",
          json_agg(json_build_object(
              'img', c.img,
              'name', c.name,
              'description', c.description
          )) AS comments
      FROM destinations d
      LEFT JOIN comments c ON d.id = c.destination_id
      WHERE d.id = $1
      GROUP BY d.id
    `

      const destinationsWithComments = await cliente.query(queryString, id)

      return destinationsWithComments
    } catch (error) {
      console.error(`Error al obtener el destino con id: ${id}`, error)
      throw error
    }
  }

  static async create ({ input }) {
    try {
      const {
        tourOption,
        slug,
        title,
        name,
        imgSlider,
        description,
        timeTravel,
        itinerary,
        considerations,
        additional,
        price,
        imgCarousel,
        comments
      } = input

      const uuidResult = await cliente.query('SELECT uuid_generate_v4()')
      const uuid = uuidResult[0].uuid_generate_v4

      await cliente.query(`
        INSERT INTO destinations (id, touroption, slug, title, name, imgslider, description, timetravel, itinerary, considerations, additional, price, imgcarousel)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [uuid, tourOption, slug, title, name, imgSlider, description, timeTravel, itinerary, considerations, additional, price, imgCarousel])

      if (comments && comments.length > 0) {
        for (const comment of comments) {
          const { img, name, description } = comment
          await cliente.query(`
          INSERT INTO comments ("destination_id", "img", "name", "description")
          VALUES ($1, $2, $3, $4);
          `, [uuid, img, name, description])
        }
      }

      const destination = await cliente.query(
        'SELECT * FROM destinations WHERE id = $1',
        [uuid]
      )

      return destination
    } catch (error) {
      console.error('Error al crear el nuevo destino', error)
      throw error
    }
  }

  static async delete ({ id }) {
    try {
      await cliente.query(`
        DELETE FROM comments 
        WHERE destination_id = $1
      `, id)
      const deleteDestination = await cliente.query(`
        DELETE FROM destinations
        WHERE id = $1
        RETURNING id
      `, id)
      const result = deleteDestination.length
      return result
    } catch (error) {
      console.error(`Error al obtener el destino con id: ${id}`, error)
      throw error
    }
  }

  static async update ({ id, input }) {
    try {
      const findDestination = await cliente.query(`
        SELECT * FROM destinations WHERE id = $1
      `, id)
      console.log(findDestination)
      console.log('xddd')
      if (findDestination.length === 0) return false

      const {
        tourOption,
        slug,
        title,
        name,
        imgSlider,
        description,
        timeTravel,
        itinerary,
        considerations,
        additional,
        price,
        imgCarousel
      } = input

      const updatedDestination = await cliente.query(
      `
      UPDATE destinations
      SET 
          touroption = COALESCE($1, touroption),
          slug = COALESCE($2, slug),
          title = COALESCE($3, title),
          name = COALESCE($4, name),
          imgslider = COALESCE($5, imgslider::TEXT[]),
          description = COALESCE($6, description),
          timetravel = COALESCE($7, timetravel),
          itinerary = COALESCE($8, itinerary::TEXT[]),
          considerations = COALESCE($9, considerations::TEXT[]),
          additional = COALESCE($10, additional::TEXT[]),
          price = COALESCE($11, price),
          imgcarousel = COALESCE($12, imgcarousel::TEXT[])
      WHERE id = $13
      RETURNING id
      `,
      [
        tourOption,
        slug,
        title,
        name,
        imgSlider,
        description,
        timeTravel,
        itinerary,
        considerations,
        additional,
        price,
        imgCarousel,
        id
      ]
      )
      return updatedDestination
    } catch (error) {
      console.error(`Error al obtener el destino con id: ${id}`, error)
      throw error
    }
  }
}
