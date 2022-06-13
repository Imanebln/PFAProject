import { Injectable } from '@angular/core';
import { Food } from '../models/food.module';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  getFoods(): Food[] {
    return [
      {
        id: 1,
        title: 'HTML CSS',
        price: 12,
        image: '../../assets/images/HtmlandCss.png',
        description: 'are two of the core technologies for building Web pages.',
      },
      {
        id: 2,
        title: 'Javascript',
        price: 12,
        image: '../../assets/images/javascript.png',
        description: 'JavaScript is the Programming Language for the Web.',
      },
      {
        id: 3,
        title: 'Jquery',
        price: 12,
        image: '../../assets/images/jquery.png',
        description:
          'jQuery is a fast, small, and feature-rich JavaScript library.',
      },
      {
        id: 4,
        title: 'Django',
        price: 12,
        image: '../../assets/images/django.png',
        description:
          'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. ',
      },
      {
        id: 5,
        title: 'MySql',
        price: 12,
        image: '../../assets/images/mysql.png',
        description:
          'MySQL is a relational database management system (RDBMS) developed by Oracle that is based on structured query language (SQL).',
      },
      {
        id: 6,
        title: 'Docker',
        price: 12,
        image: '../../assets/images/docker.png',
        description:
          'Docker is an open platform for developing, shipping, and running applications.',
      },
    ];
  }
  getFood(id: number): Food {
    return this.getFoods().find((food) => food.id === id);
  }
}
