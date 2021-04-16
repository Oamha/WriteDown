## 实现一个压线的弹性小球
### 1、先看效果
<Common-Thumb :width="400" :urls="'bounce-ball.gif'" :prefix="'/img/practice/ui-effect'"/>
### 2、实现思路
+ 绘制初始状态：一个小球，一条二阶贝塞尔曲线（控制点、起点、终点在一条水平线上）及其两个端点（用小球表示）;
+ 绘制压线下落过程：主要利用公式计算贝塞尔曲线控制点变化过程中小球在曲线上的纵坐标。动画过程用`ValueAnimator`设置动画模式为反向，重复次数为1次即可模拟，为了使其效果更真实，设置减速差值器;
+ 绘制小球独自上升过程：也是使用`ValueAnimator`实现,设置重复模式为反向，重复次数为1次;
### 3、具体代码
``` java
public class BounceView extends View implements View.OnClickListener {

    //起点
    private int mStartX;
    private int mStartY;

    //控制点
    private int mCenterX;
    private int mCenterY;

    //终点
    private int mEndX;
    private int mEndY;

    private Paint mLinePaint;
    private Paint mCirclePaint;
    private Path mBezierPath;

    private float mPosY;
    private int mCircleRadius = 20;
    private int mTerminalCircleRadius = 15;

    private ValueAnimator mValueAnimator;
    private ValueAnimator mUpValueAnimator;

    private static final String TAG = "BounceView";


    public BounceView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        //绘制圆的画笔
        mCirclePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mCirclePaint.setStyle(Paint.Style.FILL);

        //绘制曲线的画笔
        mLinePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mLinePaint.setStyle(Paint.Style.STROKE);
        mLinePaint.setStrokeWidth(6);
        //贝塞尔曲线的路径
        mBezierPath = new Path();
        setOnClickListener(this);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        mStartX = w / 4;
        mStartY = h / 2;
        mEndX = w / 4 * 3;
        mEndY = mStartY;
        mCenterX = w / 2;
        mCenterY = mStartY;
        mPosY = mCenterY;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        mBezierPath.reset();
        mBezierPath.moveTo(mStartX, mStartY);
        mBezierPath.quadTo(mCenterX, mCenterY, mEndX, mEndY);
        canvas.drawPath(mBezierPath, mLinePaint);
        mCirclePaint.setColor(Color.RED);
        canvas.drawCircle(mCenterX, mPosY - mCircleRadius, mCircleRadius, mCirclePaint);
        mCirclePaint.setColor(Color.BLACK);
        canvas.drawCircle(mStartX, mStartY, mTerminalCircleRadius, mCirclePaint);
        canvas.drawCircle(mEndX, mEndY, mTerminalCircleRadius, mCirclePaint);
    }


    @Override
    public void onClick(View v) {
        if (mValueAnimator != null && mUpValueAnimator != null) {
            if (mValueAnimator.isPaused()) {
                mValueAnimator.resume();
            } else {
                mValueAnimator.pause();
            }

            if (mUpValueAnimator.isPaused()) {
                mUpValueAnimator.resume();
            } else {
                mUpValueAnimator.pause();
            }

        } else {
            //小球压着线向下的动画
            mValueAnimator = ValueAnimator.ofInt(mCenterY, mCenterY + 400);
            mValueAnimator.setInterpolator(new DecelerateInterpolator());
            mValueAnimator.setRepeatMode(ValueAnimator.REVERSE);
            mValueAnimator.setRepeatCount(1);
            mValueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator animation) {
                    //(1) 计算小球随着贝塞尔曲线下落时的纵坐标, x,y为待求的小球的坐标，startPoint,controlPoint,endPoint为贝塞尔曲线的起点，控制点，终点
                    //(2) v为贝塞尔曲线的系数，取值为0-1，这里都取得是0.5
                    //(3) 由于只是下落，所以只求纵坐标就可以了
                    //(4) 计算公式：
                    // x = (1-v)*(1-v)*startPoint.x + 2*v*(1-v)*controlPoint.x + v*v*endPoint.x;
                    // y = (1-v)*(1-v)*startPoint.y + 2*v*(1-v)*controlPoint.y + v*v*endPoint.y;
                    int animatedValue = (int) animation.getAnimatedValue();
                    mPosY = 0.25f * mStartY + 0.5f * animatedValue + 0.25f * mEndY;
                    mCenterY = animatedValue;
                    invalidate();
                }
            });
            mValueAnimator.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    //上升到中点时触发小球上升动画
                    if (mUpValueAnimator != null) {
                        mUpValueAnimator.start();
                    }
                }
            });
            //小球向上弹起然后下落的动画
            mUpValueAnimator = ValueAnimator.ofFloat(mCenterY, mCenterY - 200);
            mUpValueAnimator.setInterpolator(new DecelerateInterpolator());
            mUpValueAnimator.setRepeatCount(1);
            mUpValueAnimator.setRepeatMode(ValueAnimator.REVERSE);
            mUpValueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator animation) {
                    mPosY = (float) animation.getAnimatedValue();
                    invalidate();
                }
            });
            mUpValueAnimator.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    //下落到中点时触发压线下落动画
                    if (mValueAnimator != null) {
                        mValueAnimator.start();
                    }
                }
            });
            mValueAnimator.start();
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        if (mUpValueAnimator != null) {
            mUpValueAnimator.cancel();
            mUpValueAnimator = null;
        }
        if (mValueAnimator != null) {
            mValueAnimator.cancel();
            mValueAnimator = null;
        }
    }
}
```