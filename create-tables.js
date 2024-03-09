import pgPromise from 'pg-promise'
import { config } from 'dotenv'

config()

const pgp = pgPromise()

const createTables = async () => {
  const client = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })

  try {
    const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE destinations (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      tourOption VARCHAR(40),
      slug VARCHAR(40),
      title VARCHAR(50),
      name VARCHAR(40),
      imgSlider TEXT[],
      description TEXT,
      timeTravel VARCHAR(50),
      itinerary TEXT[],
      considerations TEXT[80],
      additional TEXT[],
      price INTEGER,
      imgCarousel TEXT[]
    );
    
    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        destination_id UUID REFERENCES destinations(id),
        img TEXT,
        name VARCHAR(50),
        description TEXT
    );
    
    INSERT INTO destinations (id,tourOption, slug, title, name, imgSlider, description, timeTravel, itinerary, considerations, additional, price, imgCarousel) VALUES
    ('f6c2bf8d-be10-44fb-9f1b-cae0a1403fdb','Tour en la montaña', 'tour-montana', 'Montañas del Norte', 'Montañas del Norte', '{"imagen1.jpg", "imagen2.jpg", "imagen3.jpg"}', 'Disfruta de la belleza natural de las montañas del norte.', '2 días', '{"Día 1: Excursión a la montaña.", "Día 2: Senderismo."}', '{"Se recomienda llevar ropa abrigada y calzado adecuado."}', '{"Tour incluye almuerzos.", "Se proporciona transporte."}', 200, '{"imagen1.jpg", "imagen2.jpg"}'),
    ('3b71af8d-47e9-47e2-9edb-d5adbcf99ba5','Tour en la playa', 'tour-playa', 'Playas del Sur', 'Playas del Sur', '{"imagen4.jpg", "imagen5.jpg", "imagen6.jpg"}', 'Descubre las hermosas playas del sur y relájate bajo el sol.', '3 días', '{"Día 1: Disfrute de la playa.", "Día 2: Actividades acuáticas.","Día 3: Relax en la playa."}','{"Protector solar recomendado."}', '{"Tour incluye almuerzos.", "Se proporciona equipo de snorkel."}', 250, '{"imagen3.jpg", "imagen4.jpg"}'),
    ('50987c13-ec74-44b5-9d1a-9e0ba19631a9','Tour cultural', 'tour-cultural', 'Ruta del Patrimonio', 'Ruta del Patrimonio', '{"imagen7.jpg", "imagen8.jpg", "imagen9.jpg"}', 'Explora la rica historia y cultura de la región.', '4 días', '{"Día 1: Visita a museos.","Día 2: Recorrido por sitios históricos.","Día 3: Participación en eventos culturales.","Día 4: Visita a monumentos."}','{"Se recomienda llevar una cámara para capturar recuerdos."}', '{"Tour incluye entradas a museos.", "Guía turístico disponible."}', 180, '{"imagen5.jpg", "imagen6.jpg"}'),
    ('e39e0464-4793-40cc-8684-fb56959879a9','Tour de aventura', 'tour-aventura', 'Selva Amazónica', 'Selva Amazónica', '{"imagen10.jpg", "imagen11.jpg", "imagen12.jpg"}', 'Adéntrate en la misteriosa selva amazónica y explora su exuberante biodiversidad.', '5 días', '{"Día 1: Navegación por el río.","Día 2: Trekking en la selva.","Día 3: Observación de aves.","Día 4: Interacción con comunidades locales.","Día 5: Regreso."}','{"Se recomienda llevar repelente de insectos y equipo de trekking."}', '{"Tour incluye alojamiento en cabañas.", "Guía experto en la selva."}', 300, '{"imagen7.jpg", "imagen8.jpg"}'),
    ('b8c9a3b0-3d92-40a7-a1a8-d863fdf48490','Tour gastronómico', 'tour-gastronomico', 'Ruta de los Sabores', 'Ruta de los Sabores', '{"imagen13.jpg", "imagen14.jpg", "imagen15.jpg"}', 'Descubre los sabores únicos de la región en esta emocionante ruta gastronómica.', '3 días', '{"Día 1: Degustación de platos tradicionales.","Día 2: Clases de cocina.","Día 3: Visita a mercados locales."}','{"Ven con el estómago vacío y dispuesto a probar nuevos sabores."}', '{"Tour incluye todas las comidas.", "Se proporcionan recetas."}', 180, '{"imagen9.jpg", "imagen10.jpg"}'),
    ('ae30c37d-1ba0-4b3b-a7b4-e8d1efdf7874','Tour de relax', 'tour-relax', 'Retiro en la Naturaleza', 'Retiro en la Naturaleza', '{"imagen16.jpg", "imagen17.jpg", "imagen18.jpg"}', 'Escapa del ajetreo y el bullicio de la ciudad y sumérgete en la tranquilidad de la naturaleza.', '4 días', '{"Día 1: Yoga y meditación.","Día 2: Senderismo en la montaña.","Día 3: Spa y masajes.","Día 4: Relajación en la piscina natural."}','{"Lleva ropa cómoda y una mente abierta para relajarte y rejuvenecer."}', '{"Tour incluye alojamiento en cabañas eco-amigables.", "Se proporcionan sesiones de yoga y meditación."}', 250, '{"imagen11.jpg", "imagen12.jpg"}');
    
    INSERT INTO comments (destination_id, img, name, description) VALUES
    ('f6c2bf8d-be10-44fb-9f1b-cae0a1403fdb', 'ruta/a/la/imagen11.jpg', 'Laura Gómez', 'Excelente experiencia. Las montañas ofrecen vistas increíbles.'),
    ('f6c2bf8d-be10-44fb-9f1b-cae0a1403fdb', 'ruta/a/la/imagen12.jpg', 'Javier Rodríguez', 'Disfruté mucho de la caminata. El clima fue perfecto.'),
    ('f6c2bf8d-be10-44fb-9f1b-cae0a1403fdb', 'ruta/a/la/imagen13.jpg', 'Marina García', 'Recomiendo este tour a cualquiera que ame la naturaleza y el aire libre.'),
    ('3b71af8d-47e9-47e2-9edb-d5adbcf99ba5', 'ruta/a/la/imagen14.jpg', 'Carlos Pérez', '¡Increíble experiencia en las playas del sur! Arena blanca y aguas cristalinas.'),
    ('3b71af8d-47e9-47e2-9edb-d5adbcf99ba5', 'ruta/a/la/imagen15.jpg', 'Ana Martínez', 'Me encantaron las actividades acuáticas. ¡Fue una aventura emocionante!'),
    ('3b71af8d-47e9-47e2-9edb-d5adbcf99ba5', 'ruta/a/la/imagen16.jpg', 'Roberto Sánchez', 'Pasé días relajantes en la playa. ¡Volvería en cualquier momento!'),
    ('50987c13-ec74-44b5-9d1a-9e0ba19631a9', 'ruta/a/la/imagen17.jpg', 'Elena Gutiérrez', 'La Ruta del Patrimonio ofrece una visión fascinante de la historia local.'),
    ('50987c13-ec74-44b5-9d1a-9e0ba19631a9', 'ruta/a/la/imagen18.jpg', 'Pablo Fernández', 'Disfruté mucho explorando los sitios históricos. ¡Una experiencia educativa!'),
    ('50987c13-ec74-44b5-9d1a-9e0ba19631a9', 'ruta/a/la/imagen19.jpg', 'Lucía Rodríguez', 'Los monumentos son impresionantes. ¡No te los pierdas si visitas esta región!'),
    ('e39e0464-4793-40cc-8684-fb56959879a9', 'ruta/a/la/imagen20.jpg', 'Sofía Martínez', 'La selva amazónica es increíblemente hermosa. ¡Una experiencia única en la vida!'),
    ('e39e0464-4793-40cc-8684-fb56959879a9', 'ruta/a/la/imagen21.jpg', 'Diego Pérez', 'El trekking en la selva fue desafiante pero emocionante. ¡Volvería enseguida!'),
    ('e39e0464-4793-40cc-8684-fb56959879a9', 'ruta/a/la/imagen22.jpg', 'María González', 'La interacción con las comunidades locales fue una experiencia enriquecedora.'),
    ('b8c9a3b0-3d92-40a7-a1a8-d863fdf48490', 'ruta/a/la/imagen23.jpg', 'Marcos Gómez', 'Probé algunos platos increíbles durante la ruta gastronómica. ¡Delicioso!'),
    ('b8c9a3b0-3d92-40a7-a1a8-d863fdf48490', 'ruta/a/la/imagen24.jpg', 'Lucas Rodríguez', 'Las clases de cocina fueron divertidas y educativas. ¡Aprendí muchas recetas nuevas!'),
    ('b8c9a3b0-3d92-40a7-a1a8-d863fdf48490', 'ruta/a/la/imagen25.jpg', 'Eva Martínez', 'Los mercados locales tienen una gran variedad de productos frescos. ¡Me encantó explorarlos!'),
    ('ae30c37d-1ba0-4b3b-a7b4-e8d1efdf7874', 'ruta/a/la/imagen26.jpg', 'Jorge Fernández', 'El retiro en la naturaleza fue exactamente lo que necesitaba para recargar energías.'),
    ('ae30c37d-1ba0-4b3b-a7b4-e8d1efdf7874', 'ruta/a/la/imagen27.jpg', 'Valentina Gutiérrez', 'El yoga y la meditación en la montaña fueron experiencias transformadoras.'),
    ('ae30c37d-1ba0-4b3b-a7b4-e8d1efdf7874', 'ruta/a/la/imagen28.jpg', 'Gonzalo Pérez', 'Los masajes en el spa fueron relajantes y revitalizantes. ¡Perfecto para desconectar!');  
    
    `

    await client.none(createTablesQuery)
    console.log('Tablas creadas exitosamente')
  } catch (error) {
    console.error('Error al crear las tablas:', error)
  } finally {
    pgp.end()
  }
}

createTables()
