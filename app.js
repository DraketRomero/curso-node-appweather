import {
	inquirerMenu,
	leerInput,
	listarLugares,
	pausa,
} from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

const main = async () => {
	const busquedas = new Busquedas();

	let opt = 0;

	do {
		opt = await inquirerMenu();

		switch (opt) {
			case 1:
				// TODO: Mostrar mensaje
				const searchedCity = await leerInput("Ciudad: ");

				// TODO: Buscar los lugares
				const lugares = await busquedas.ciudad(searchedCity);

				// TODO: Seleccionar el lugar
				const selectedId = await listarLugares(lugares);

				if (selectedId === 0) continue;

				const selectedPlace = lugares.find((plc) => plc.id === selectedId);

				// TODO: Guardar en db
				busquedas.agregarHistorial(selectedPlace.nombre);

				// TODO: Llamada al metodo de obtencion del clima
				const { nombre, lng, lat } = selectedPlace;
				const clima = await busquedas.climaPorLugar(lat, lng);
				console.log(clima);

				// TODO: Mostrar resultados
				console.clear();
				console.log("\nInformacion de la ciudad\n".green);
				console.log(`Ciudad: ${nombre.green}`);
				console.log(`Lat: ${lat}`);
				console.log(`Lng: ${lng}`);
				console.log(`Temperatura: ${clima.norTemp}`);
				console.log(`Minima: ${clima.tempMin}`);
				console.log(`Maxima: ${clima.tempMax}`);
				console.log(`Estado del clima: ${clima.des.green}`);

				break;

			case 2:
				busquedas.historialCapitalizado.forEach((plc, i) => {
					const idx = `${i + 1}`.green;

					console.log(`${idx} ${plc}`);
				});
				break;
		}

		if (opt !== 0) await pausa();
	} while (opt !== 0);
};

main();
