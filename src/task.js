export default class Task {
  constructor(name, description, dueDate, priority, notes, project) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.project = project;
  }
}