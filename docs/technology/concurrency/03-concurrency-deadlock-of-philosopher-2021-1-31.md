## 哲学家就餐问题
### 1、问题模拟
```java
import java.util.concurrent.locks.ReentrantLock;

/**
 * 哲学家就餐问题
 * 哲学家们围成一桌边讨论问题边吃饭，每个人左右手各放一只筷子，只有拿到两只筷子才可以吃饭
 */
public class PhilosopherDemo {

    public static void main(String[] args) {
        //四只筷子
        Chopstick chopstick1 = new Chopstick();
        Chopstick chopstick2 = new Chopstick();
        Chopstick chopstick3 = new Chopstick();
        Chopstick chopstick4 = new Chopstick();

        //四个哲学家
        Philosopher philosopher1 = new Philosopher(chopstick4, chopstick1, "苏格拉底");
        Philosopher philosopher2 = new Philosopher(chopstick1, chopstick2, "亚里士多德");
        Philosopher philosopher3 = new Philosopher(chopstick2, chopstick3, "阿基米德");
        Philosopher philosopher4 = new Philosopher(chopstick3, chopstick4, "柏拉图");

        //哲学家开始吃饭
        philosopher1.start();
        philosopher2.start();
        philosopher3.start();
        philosopher4.start();
    }


    /**
     * 哲学家线程类
     */
    static class Philosopher extends Thread {
        private Chopstick leftChopstick;
        private Chopstick rightChopstick;

        public Philosopher(Chopstick leftChopstick, Chopstick rightChopstick, String name) {
            super(name);
            this.leftChopstick = leftChopstick;
            this.rightChopstick = rightChopstick;
        }

        @Override
        public void run() {
//            eat();
            deadLockEat();
        }

        //会造成死锁
        public void deadLockEat() {
            while (true) {
                leftChopstick.lock();
                try {
                    rightChopstick.lock();
                    try {
                        System.out.println("哲学家" + Thread.currentThread().getName() + "开始吃饭");
                    } finally {
                        rightChopstick.unlock();
                    }
                } finally {
                    leftChopstick.unlock();
                }
            }
        }

        //不会造成死锁
        public void eat() {
            while (true) {
                if (leftChopstick.tryLock()) {
                    try {
                        if (rightChopstick.tryLock()) {
                            try {
                                System.out.println("哲学家" + Thread.currentThread().getName() + "开始吃饭");
                            } finally {
                                rightChopstick.unlock();
                            }
                        }
                    } finally {
                        leftChopstick.unlock();
                    }
                }
            }
        }
    }

    /**
     * 筷子（这个问题中筷子作为竞争的资源）
     */
    static class Chopstick extends ReentrantLock {

    }
}
```
### 2、死锁检测：
```java
Found one Java-level deadlock:
=============================
"柏拉图":
  waiting for ownable synchronizer 0x0000000755f837e8, (a java.util.concurrent.locks.ReentrantLock$NonfairSync),
  which is held by "苏格拉底"
"苏格拉底":
  waiting for ownable synchronizer 0x0000000755f83758, (a java.util.concurrent.locks.ReentrantLock$NonfairSync),
  which is held by "亚里士多德"
"亚里士多德":
  waiting for ownable synchronizer 0x0000000755f83788, (a java.util.concurrent.locks.ReentrantLock$NonfairSync),
  which is held by "阿基米德"
"阿基米德":
  waiting for ownable synchronizer 0x0000000755f837b8, (a java.util.concurrent.locks.ReentrantLock$NonfairSync),
  which is held by "柏拉图"
```
