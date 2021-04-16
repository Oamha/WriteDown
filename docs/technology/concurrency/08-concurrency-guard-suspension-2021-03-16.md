## 保护性暂停模式
::: tip 概念
如果一个线程要等待另一个线程的结果，通常要用到保护性暂停模式。
:::
```java
public class FutureResult<T> {
    private T result;
    private Object lock = new Object();

    //阻塞式获取
    public T get() {
        synchronized (lock) {
            while (result == null) {
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            return result;
        }
    }

    //带超时的获取
    public T get(long time) {
        //起始时间
        long beginTime = System.currentTimeMillis();
        //已经等待的时间
        long timeCost = 0;
        synchronized (lock) {
            while (result == null) {
                //还需要等待的时间
                long timeToWait = time - timeCost;
                if (timeToWait <= 0) {
                    return null;
                }
                try {
                    lock.wait(timeToWait);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                //唤醒后重新计算已经等待的时间，如果不够，再次进入wait，防止虚假唤醒
                timeCost = System.currentTimeMillis() - beginTime;
            }
            return result;
        }
    }

    //返回结果，唤醒等待线程
    public void setResult(T result) {
        synchronized (lock) {
            this.result = result;
            lock.notifyAll();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        FutureResult<String> result = new FutureResult<>();
        new Thread(() -> {
            System.out.println(" response:" + result.get());
        }).start();

        sleep(1000);

        new Thread(() -> {
            //虚假唤醒一次
            try {
                sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            result.setResult(null);

            //拿到结果，再次唤醒
            try {
                sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            result.setResult("success");
        }).start();
    }
}
```
::: tip 补充
join方法、future的实现都是保护性暂停的思想。
:::