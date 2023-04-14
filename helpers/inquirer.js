import inquirer from "inquirer";
import "colors";

const preguntas = [
	{
		type: "list",
		name: "opcion",
		message: "Que desea hacer?",
		choices: [
			{
				value: 1,
				name: `${"1.-".green} Buscar ciudad.`,
			},
			{
				value: 2,
				name: `${"2.-".green} Historial.`,
			},
			{
				value: 0,
				name: `${"0.-".green} Salir.`,
			},
		],
	},
];

const inquirerMenu = async () => {
	console.clear();
	console.log("===========================".green);
	console.log("== Seleccione una opcion ==".white);
	console.log("===========================".green);

	const { opcion } = await inquirer.prompt(preguntas);

	return opcion;
};

const pausa = async () => {
	const question = [
		{
			type: "input",
			name: "enter",
			message: `Presione ${"enter".green} para continuar.`,
		},
	];

	console.log("\n");

	await inquirer.prompt(question);
};

const leerInput = async (message) => {
	const question = [
		{
			type: "input",
			name: "desc",
			message,
			validate(value) {
				if (value.length === 0) {
					return "Porfavor ingrese un valor";
				}

				return true;
			},
		},
	];

	const { desc } = await inquirer.prompt(question);

	return desc;
};

const listarLugares = async (lugares = []) => {
	const choices = lugares.map((plc, id) => {
		const idx = `${id + 1}`.green;
		return {
			value: plc.id,
			name: `${idx} ${plc.nombre}`,
		};
	});

	choices.unshift({
		value: 0,
		name: `${"0.".green} 'Cancelar'`,
	});

	const preguntas = [
		{
			type: "list",
			name: "id",
			message: "Selecccione lugar: ",
			choices,
		},
	];

	const { id } = await inquirer.prompt(preguntas);
	return id;
};

const confirmar = async (message) => {
	const question = [
		{
			type: "confirm",
			name: "ok",
			message,
		},
	];

	const { ok } = await inquirer.prompt(question);

	return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
	const choices = tareas.map((tsk, id) => {
		const idx = `${id + 1}`.green;
		return {
			value: tsk.id,
			name: `${idx} ${tsk.desc}`,
			checked: tsk.completadoEn ? true : false,
		};
	});

	const preguntas = [
		{
			type: "checkbox",
			name: "ids",
			message: "Seleccionar",
			choices,
		},
	];

	const { ids } = await inquirer.prompt(preguntas);
	return ids;
};

export {
	inquirerMenu,
	pausa,
	leerInput,
	listarLugares,
	confirmar,
	mostrarListadoChecklist,
};
