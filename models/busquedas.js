import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export class Busquedas {
	historial = [];
	dbPath = "./db/db.json";

	constructor() {
		// TODO: Leer db si existe
		this.leerDB();
	}

	get historialCapitalizado() {
		// return this.historial.forEach((lg) => lg.toUpperCase());

		return this.historial.map((lg) => {
			let palabras = lg.split(" ");

			palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

			return palabras.join(" ");
		});
	}

	get paramsMabox() {
		return {
			access_token: process.env.MAPBOX_KEY,
			language: "es",
			limit: 5,
			proximity: "ip",
		};
	}

	get paramsWeather() {
		return {
			appid: process.env.OPENWEATHER_KEY,
			units: "metric",
			lang: "es",
		};
	}

	async ciudad(lugar = "") {
		try {
			// TODO: Peticion HTTP
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
				params: this.paramsMabox,
			});

			const resp = await instance.get();
			// console.log(resp.data.features);

			return resp.data.features.map((lugar) => ({
				id: lugar.id,
				nombre: lugar.place_name,
				lng: lugar.center[0],
				lat: lugar.center[1],
			}));
		} catch (error) {
			return [];
		}
	}

	async climaPorLugar(lat, lon) {
		try {
			// TODO: Instancia de axios
			const instance = axios.create({
				baseURL: "https://api.openweathermap.org/data/2.5/weather",
				params: {
					lat,
					lon,
					...this.paramsWeather,
				},
			});

			// TODO: Obtener respuesta
			const res = await instance.get();
			const { weather, main } = res?.data;

			// TODO: Generar objeto de respuesta
			return {
				des: weather[0].description,
				tempMin: main.temp_min,
				tempMax: main.temp_max,
				norTemp: main.temp,
			};
		} catch (error) {
			console.log(error);
		}
	}

	guardarDB() {
		const payload = {
			historial: this.historial,
		};

		fs.writeFileSync(this.dbPath, JSON.stringify(payload));
	}

	leerDB() {
		// TODO: Verificar la existencia del archivo
		if (!fs.existsSync(this.dbPath)) return;

		// TODO: Leer del archivo JSON
		const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
		const data = JSON.parse(info);

		this.historial = data.historial;
	}

	agregarHistorial(lugar = "") {
		// TODO: Prevenir duplicados
		if (this.historial.includes(lugar.toLocaleLowerCase())) {
			return;
		}

		this.historial.unshift(lugar.toLocaleLowerCase());

		// TODO: Grabar en archivo de texto
		this.guardarDB();
	}
}
