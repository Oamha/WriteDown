---
sidebar: 'auto'
---
## Android中Activity的启动模式
### 1、Standard模式
标准启动模式，这是默认的启动模式，每启动一个Activity，都会创建新的实例，放入任务栈中；
如A启动B，B启动C，A，B，C会依次被压入栈中。
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'standard-mode-of-activity.png'"/>
<center>如图以Standard模式依次启动A、B、C</center>

### 2、SingleTop模式
SingleTop是栈顶复用模式，如果要启动的Activity已经位于栈顶，则不会重新创建新的实例；
如当前要以SingleTop模式启动Activity B，栈中已存在A，B，B位于栈顶，则此时会复用B。
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'singletop-mode-of-activity.png'"/>
<center>如图以SingleTop模式启动B</center>

### 3、SingleTask模式
SingleTask表示如果当前任务栈存在要启动Activity实例，则将任务栈中的该实例置顶，并弹出该Activity之上的所有Activity。如当前任务栈中为A，B，C，此时要以SingleTask模式创建Activity A，则会将B、C弹出，A置顶。
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'singletask-mode-of-activity.jpg'"/>
<center>如图以SingleTask模式启动A</center>

### 4、SingleInstance模式
SingleInstance会重新启动一个任务栈，将创建的Activity实例放入其中并取得焦点，该任务栈只存在一个Activity。该Activity再启动其它Activity会在原始的任务栈中进行创建。如以SingleInstance启动C后，再从C启动D，D会在原来的任务栈（即任务栈1）中创建。如果再从D启动C，由于C是SingleInstance，此时又会回到任务栈2。
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'singleinstance-mode-of-activity.jpg'"/>
<center>如图以SingleInstance模式启动C</center>
::: details 通过代码设置启动模式
intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);    //与SingleTask相同
intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);   //与SingleTop相同
intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);   //清除记录
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);     //与SingleInstance相同
:::