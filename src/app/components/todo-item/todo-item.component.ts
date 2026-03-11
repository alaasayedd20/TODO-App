import { Component, input, output, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITodo } from '../../itodo';
import { title } from 'process';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  constructor(){
    effect(()=>{
      const tasks = JSON.stringify(this.todoList());
      localStorage.setItem('myTasks', tasks);
    })
  }
  selectedFilter = signal('all')
  searchText = signal('');
  filteredTodos = computed(()=>{
    let list = this.todoList();
    if(this.searchText()){
      list = list.filter(item => item.title.includes(this.searchText()));
    }
    if(this.selectedFilter() != 'all'){
      list = list.filter(item => item.category === this.selectedFilter())
    }
    return list;
  })

  newTaskTitle = '';
  selectedCategory= 'personal';
  selectedPriority= 'low';
  addTask(){
    if(this.newTaskTitle.trim().length === 0){return};
    let newTodo:ITodo = {
      id: Date.now(),
      title: this.newTaskTitle,
      category: this.selectedCategory,
      priority: this.selectedPriority,
      completed: false,
    }
    this.todoList.update(currentItems => [...currentItems, newTodo])
    this.newTaskTitle = '';
  }
  deleteTask(id: number){
    this.todoList.update(allTodos => allTodos.filter(item => item.id !== id))
  }
  editingTaskId = signal<number | null>(null);
  oldTitle="";
  startEdit(item: ITodo):void{
    this.editingTaskId.set(item.id);
    this.oldTitle = item.title;
  }
  saveEdit():void{
    this.editingTaskId.set(null);
  }
  cancelEdit(item: ITodo):void{
    item.title = this.oldTitle
    this.editingTaskId.set(null);
  }

  savedTasks = localStorage.getItem('myTasks')
  todoList = signal<ITodo[]>(this.savedTasks ? JSON.parse(this.savedTasks) : []);

  totalTasks= computed(()=>{
    return this.todoList().length;
  })


  completedTasks = computed(()=>{
    return this.todoList().filter(item => item.completed === true);
  })

  computedTasks = computed(()=>{
    return this.completedTasks().length;
  })

  updateStat(){
    this.todoList.update(todos => [...todos])
  }

  progressPercent= computed(()=>{
    return this.computedTasks() / this.totalTasks() *100;
  })

}
