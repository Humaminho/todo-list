import './styles.css'
const projects = [];
class Section {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    this.isProject = false;
  } 
}

class Project extends Section {
  constructor(name) {
    super(name);
    this.isProject = true;
  }
}

function createProject(name) {
  const project = new Project(name);
  projects.push(project);
}