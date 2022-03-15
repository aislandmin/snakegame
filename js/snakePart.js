class SnakePart {
  constructor(x, y, dir, next) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.next = next; //下一步要走的位置，指向头部行动轨迹数组的某一个元素
  }
}
