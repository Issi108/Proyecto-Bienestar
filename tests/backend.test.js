const request = require('supertest');
const app = require('../server'); // Importamos el servidor

describe('Pruebas de Autenticación y Planning', () => {

    // TEST 1: Que el registro falle si el email ya existe
    it('Debería devolver un error 400 si el email ya está registrado', async () => {
        const res = await request(app)
            .post('/api/auth/registro')
            .send({
                nombre: 'Usuario Prueba',
                email: 'isabel@ejemplo.com', 
                password: 'password123',
                nivel_id: 1,
                estado_preferente_id: 1
            });

        // Comprobamos que el sistema lo rechaza y lanza el mensaje correcto
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('El correo electrónico ya está registrado.');
    });

    // TEST 2: Que la generación devuelva 5 vídeos (o que diga que ya existe)
    it('Debería generar un planning con exactamente 5 vídeos o devolver el existente', async () => {
        const res = await request(app)
            .post('/api/planning/generar')
            .send({
                id_usuario: 1 
            });

        // Comprobamos que la respuesta sea un éxito (200 si ya existe, 201 si es nuevo)
        expect(res.statusCode).toBeLessThan(300);

        // Si el planning ya existía y te lo devuelve para mostrarlo:
        if (res.body.planning) {
            expect(res.body.planning.length).toBe(5); // Exigimos que sean exactamente 5 vídeos
        } 
        // Si el planning es nuevo, comprobamos que devuelva el mensaje de éxito
        else {
            expect(res.body.mensaje).toBe('Planning semanal generado con éxito');
        }
    });

});