// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .trim()
    .notEmpty()
    .withMessage("El code es obligatorio")
    .custom(async (code) => {
      const found = await ProjectModel.findOne({ where: { code } });
      if (found) throw new Error("El code ya existe");
      return true;
    }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria"),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional({ values: "falsy" })
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage("El estado no es válido"),
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .isDate()
    .withMessage("La fecha de inicio debe ser válida"),
  body("budget")
    .isFloat({ gt: 0 })
    .withMessage("El presupuesto debe ser un número positivo"),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  body("leader_id")
    .notEmpty()
    .withMessage("El líder es obligatorio")
    .custom(async (leader_id) => {
      const user = await UserModel.findByPk(leader_id);
      if (!user) throw new Error("El líder no existe o no está activo");
      return true;
    }),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Las tecnologías deben ser una lista")
    .custom(async (ids) => {
      for (const id of ids) {
        const found = await TechnologyModel.findByPk(id);
        if (!found) throw new Error(`La tecnología con id ${id} no existe`);
      }
      return true;
    }),
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional({ values: "falsy" })
    .custom(async (code, { req }) => {
      const found = await ProjectModel.findOne({ where: { code } });
      if (found && found.id !== Number(req.params.id)) {
        throw new Error("El code ya existe");
      }
      return true;
    }),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional({ values: "falsy" })
    .isIn(["planning", "in_progress", "paused", "finished"])
    .withMessage("El estado no es válido"),
  body("start_date")
    .optional({ values: "falsy" })
    .isDate()
    .withMessage("La fecha de inicio debe ser válida"),
  body("budget")
    .optional({ values: "falsy" })
    .isFloat({ gt: 0 })
    .withMessage("El presupuesto debe ser un número positivo"),
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional({ values: "falsy" })
    .custom(async (leader_id) => {
      const user = await UserModel.findByPk(leader_id);
      if (!user) throw new Error("El líder no existe o no está activo");
      return true;
    }),
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologies")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("Las tecnologías deben ser una lista")
    .custom(async (ids) => {
      for (const id of ids) {
        const found = await TechnologyModel.findByPk(id);
        if (!found) throw new Error(`La tecnología con id ${id} no existe`);
      }
      return true;
    }),
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
