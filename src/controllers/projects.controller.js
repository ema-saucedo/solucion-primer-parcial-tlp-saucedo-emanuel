// * ARCHIVO A COMPLETAR
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";
// TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
export const createProject = async (req, res) => {
  try {
    const { code, name, description, status, budget, start_date, leader_id } = req.body;

    const newProject = await ProjectModel.create({
      code,
      name,
      description,
      status,
      budget,
      start_date,
      leader_id: req.user.id,
    });

    return res.status(201).json({
      message: "Proyecto creado correctamente",
      project: newProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
// ? Revisar de dónde debe salir el leader del proyecto.
// TODO: 2. Asociar al project las technologies recibidas.
export const addTechnologiesToProjects= async (req, res) => {
  try {
    const { project_id, technology_id } = req.body;

    const project = await ProjectModel.findByPk(project_id);

    if (!project) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    const technology = await TechnologyModel.findByPk(technology_id);

    if (!technology) {
      return res.status(404).json({
        message: "Tecnología no encontrado",
      });
    }

    const TechnoToProject = await ProjectTechnologyModel.create({
      project_id,
      technology_id,
    });

    return res.status(201).json({
      TechnoToProject,
      message: "Tecnología agregada al proyecto correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};


// TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
export const getAllProjects = async (req, res) => {
  try {
    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "Leader",
          attributes: ["id","username"]
        },
        {
          model: TechnologyModel,
          as: "technologies"
        }
      ]
    });
    return res.status(200).json({
      projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
     const projects = await ProjectModel.findAll({
      where: {
        leader_id: req.user.id,
      },
      include: [
        {
          model: TechnologyModel,
          as: "technologies"
        }
      ]
    });

    return res.status(200).json({
      projects,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    // TODO: 1. Actualizar el project con los datos recibidos.
    const project = await ProjectModel.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    const { code, name, description, status, budget, start_date } = req.body;

    await project.update({
      code,
      name,
      description,
      status,
      budget,
      start_date,
    });
    
    // TODO: 2. Reemplazar sus technologies si vienen en el body.

    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
    return res.status(200).json({
      message: "Artículo actualizado correctamente",
      project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
    const project = await ProjectModel.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Proyecto no encontrado",
      });
    }

    await ProjectTechnologyModel.destroy({
      where: {
        project_id: project.id,
      },
    });

    await project.destroy();

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};
