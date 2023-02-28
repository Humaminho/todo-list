export default class Section {
  constructor(name) {
    this.name = name;
    this.tasks = [];
    this.isProject = false;
  }
  
}

export class Project extends Section {
  constructor(name) {
    super(name);
    this.isProject = true;
  }
}