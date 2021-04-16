## 1、贝塞尔曲线
::: tip
贝塞尔曲线是用精确的数学公式来描述其路径的一种曲线。贝塞尔曲线通常包含多个控制点，第一个控制点又被称为起点，最后一个控制点又被称为终点。贝塞尔曲线被广泛应用于UI设计、动画设计、工业生产中。
:::
## 2、一阶贝塞尔曲线
一阶贝塞尔曲线曲线是一条直线。
## 3、二阶贝塞尔曲线
二阶贝塞尔曲线有一个控制点，一个起点，一个终点。下面用Android绘图API实现二阶贝塞尔曲线的绘制：
``` java
public class QuadraticBezierView extends View {
    private int mStartX;
    private int mStartY;

    private int mControlX;
    private int mControlY;

    private int mEndX;
    private int mEndY;

    private Paint mPointPaint;
    private Paint mBezierPaint;
    private Paint mTextPaint;
    private Paint mPathPaint;

    private Path mBezierPath;

    public QuadraticBezierView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    private void initView() {
        mBezierPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBezierPaint.setStrokeWidth(4);
        mBezierPaint.setStyle(Paint.Style.STROKE);

        mPointPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPointPaint.setStyle(Paint.Style.STROKE);
        mPointPaint.setStrokeWidth(15);
        mPointPaint.setColor(Color.DKGRAY);
        mPointPaint.setStrokeCap(Paint.Cap.ROUND);
        mPointPaint.setStrokeJoin(Paint.Join.MITER);

        mTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTextPaint.setTextSize(40);
        mTextPaint.setColor(Color.RED);

        mPathPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPathPaint.setColor(Color.BLUE);
        mPathPaint.setStyle(Paint.Style.STROKE);
        mPathPaint.setStrokeWidth(8);

        mBezierPath = new Path();
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        mStartX = w / 4;
        mStartY = h / 2;

        mControlX = w / 2;
        mControlY = mStartY - 400;

        mEndX = w / 4 * 3;
        mEndY = mStartY;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        mBezierPath.reset();
        mBezierPath.moveTo(mStartX, mStartY);
        mBezierPath.quadTo(mControlX, mControlY, mEndX, mEndY);
        //绘制贝塞尔曲线
        canvas.drawPath(mBezierPath, mBezierPaint);
        //绘制点
        canvas.drawPoint(mStartX, mStartY, mPointPaint);
        canvas.drawPoint(mControlX, mControlY, mPointPaint);
        canvas.drawPoint(mEndX, mEndY, mPointPaint);
        //绘制文字
        canvas.drawText("P0", mStartX - mTextPaint.measureText("P0") / 2, mStartY - 40, mTextPaint);
        canvas.drawText("P1", mControlX - mTextPaint.measureText("P1") / 2, mControlY - 40, mTextPaint);
        canvas.drawText("P2", mEndX - mTextPaint.measureText("P2") / 2, mEndY - 40, mTextPaint);
        //连接控制点
        canvas.drawLine(mStartX, mStartY, mControlX, mControlY, mPathPaint);
        canvas.drawLine(mControlX, mControlY, mEndX, mEndY, mPathPaint);
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_MOVE) {
            mControlX = (int) event.getX();
            mControlY = (int) event.getY();
            invalidate();
        }
        return true;
    }
}
```
### 实现效果：
<Common-Thumb :prefix="'/img/conclusion/android'" width="300" :urls="'quadratic-bezier.gif'"/>
## 4、三阶贝塞尔曲线
``` java
public class CubicBezierView extends View {
    //起点
    private int mStartX;
    private int mStartY;

    //控制点
    private int mControlOneX;
    private int mControlOneY;
    private int mControlTwoX;
    private int mControlTwoY;

    //终点
    private int mEndX;
    private int mEndY;

    //画笔
    private Paint mPointPaint;
    private Paint mBezierPaint;
    private Paint mTextPaint;
    private Paint mPathPaint;

    //贝塞尔路径
    private Path mBezierPath;

    private boolean isDoubleTap = false;

    private static final String TAG = "CubicBezierView";

    public CubicBezierView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    private void initView() {
        //贝塞尔曲线画笔
        mBezierPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBezierPaint.setStrokeWidth(4);
        mBezierPaint.setStyle(Paint.Style.STROKE);

        //端点画笔
        mPointPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPointPaint.setStyle(Paint.Style.STROKE);
        mPointPaint.setStrokeWidth(15);
        mPointPaint.setColor(Color.DKGRAY);
        mPointPaint.setStrokeCap(Paint.Cap.ROUND);
        mPointPaint.setStrokeJoin(Paint.Join.MITER);

        //文字画笔
        mTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTextPaint.setTextSize(40);
        mTextPaint.setColor(Color.RED);

        //直线画笔
        mPathPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPathPaint.setColor(Color.BLUE);
        mPathPaint.setStyle(Paint.Style.STROKE);
        mPathPaint.setStrokeWidth(8);

        //贝塞尔路径
        mBezierPath = new Path();
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        mStartX = w / 4;
        mStartY = h / 2;

        mControlOneX = w / 2 - 200;
        mControlOneY = mStartY - 400;
        mControlTwoX = w / 2 + 200;
        mControlTwoY = mControlOneY;

        mEndX = w / 4 * 3;
        mEndY = mStartY;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        mBezierPath.reset();
        mBezierPath.moveTo(mStartX, mStartY);
        mBezierPath.cubicTo(mControlOneX, mControlOneY, mControlTwoX, mControlTwoY, mEndX, mEndY);
        //绘制贝塞尔曲线
        canvas.drawPath(mBezierPath, mBezierPaint);
        //绘制点
        canvas.drawPoint(mStartX, mStartY, mPointPaint);
        canvas.drawPoint(mControlOneX, mControlOneY, mPointPaint);
        canvas.drawPoint(mControlTwoX, mControlTwoY, mPointPaint);
        canvas.drawPoint(mEndX, mEndY, mPointPaint);
        //绘制文字
        canvas.drawText("P0", mStartX - mTextPaint.measureText("P0"), mStartY - 40, mTextPaint);
        canvas.drawText("P1", mControlOneX - mTextPaint.measureText("P1") / 2, mControlOneY - 40, mTextPaint);
        canvas.drawText("P2", mControlTwoX - mTextPaint.measureText("P2") / 2, mControlTwoY - 40, mTextPaint);
        canvas.drawText("P3", mEndX, mEndY - 40, mTextPaint);
        //连接控制点
        canvas.drawLine(mStartX, mStartY, mControlOneX, mControlOneY, mPathPaint);
        canvas.drawLine(mControlOneX, mControlOneY, mControlTwoX, mControlTwoY, mPathPaint);
        canvas.drawLine(mControlTwoX, mControlTwoY, mEndX, mEndY, mPathPaint);
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = event.getAction();
        switch (action & MotionEvent.ACTION_MASK) {
            case MotionEvent.ACTION_POINTER_DOWN:
                isDoubleTap = true;   //第二个手指触摸
                break;
            case MotionEvent.ACTION_POINTER_UP:
                isDoubleTap = false;  //第二个手指抬起
                break;
            case MotionEvent.ACTION_MOVE:
                mControlOneX = (int) event.getX(0);
                mControlOneY = (int) event.getY(0);
                if (isDoubleTap) {
                    mControlTwoX = (int) event.getX(1);
                    mControlTwoY = (int) event.getY(1);
                }
                invalidate();
                break;
        }
        return true;
    }
}
```
### 实现效果：
<Common-Thumb :prefix="'/img/conclusion/android'" width="300" :urls="'cubic-bezier.gif'"/>

## 5、使用贝塞尔曲线实现画板功能
```java
public class BezierCanvasView extends View {

    private int mStartX;
    private int mStartY;

    private int mEndX;
    private int mEndY;

    private Paint mBezierPaint;
    private Path mBezierPath;

    public BezierCanvasView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        initView();
    }

    private void initView() {
        mBezierPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBezierPaint.setStrokeWidth(4);
        mBezierPaint.setStyle(Paint.Style.STROKE);

        mBezierPath = new Path();
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawPath(mBezierPath, mBezierPaint);
    }


    @Override
    public boolean onTouchEvent(MotionEvent event) {
        //普通的绘制方法
//        switch (event.getAction()) {
//            case MotionEvent.ACTION_DOWN:
//                mBezierPath.reset();                      //再次点击的时候清空画布
//                mStartX = (int) event.getX();
//                mStartY = (int) event.getY();
//                mBezierPath.moveTo(mStartX, mStartY);
//                break;
//            case MotionEvent.ACTION_MOVE:
//                mStartX = mEndX;
//                mStartY = mEndY;
//                mEndX = (int) event.getX();
//                mEndY = (int) event.getY();
//                mBezierPath.lineTo(mEndX, mEndY);
//                break;
//        }
//        invalidate();


        //使用贝塞尔曲线优化锋利的边界
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mBezierPath.reset();
                mStartX = (int) event.getX();
                mStartY = (int) event.getY();
                mBezierPath.moveTo(mStartX, mStartY);
                break;
            case MotionEvent.ACTION_MOVE:
                mEndX = (int) event.getX();
                mEndY = (int) event.getY();
                int cx = (mEndX + mStartX) / 2;
                int cy = (mEndY + mStartY) / 2;
                mBezierPath.quadTo(cx, cy, mEndX, mEndY);
                mStartX = mEndX;
                mStartY = mEndY;
                break;
        }
        invalidate();
        return true;
    }
}
```
### 实现效果：
<Common-Thumb :prefix="'/img/conclusion/android'" width="300" :urls="'canvas.gif'"/>
## 6、模拟购物车特效
``` java
public class ShopCartView extends View implements View.OnClickListener {
    private int mStartX;
    private int mStartY;

    private int mControlX;
    private int mControlY;

    private int mEndX;
    private int mEndY;

    private int mFlagX;
    private int mFlagY;

    private Paint mCirclePaint;
    private Paint mBezierPaint;
    private Path mPath;
    private ValueAnimator mValueAnimator;

    public ShopCartView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        mPath = new Path();
        mCirclePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mCirclePaint.setStyle(Paint.Style.FILL);
        mCirclePaint.setColor(Color.RED);

        mBezierPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBezierPaint.setStyle(Paint.Style.STROKE);
        mBezierPaint.setStrokeWidth(4);
        setOnClickListener(this);
    }


    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        mStartX = 100;
        mStartY = 100;

        mEndX = 700;
        mEndY = 700;

        mControlX = 400;
        mControlY = 50;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawCircle(mStartX, mStartY, 15, mCirclePaint);
        canvas.drawCircle(mEndX, mEndY, 15, mCirclePaint);
        mPath.reset();
        mPath.moveTo(mStartX, mStartY);
        mPath.quadTo(mControlX, mControlY, mEndX, mEndY);
        canvas.drawPath(mPath, mBezierPaint);
        canvas.drawCircle(mFlagX, mFlagY, 15, mCirclePaint);
    }

    @Override
    public void onClick(View v) {
        if (mValueAnimator == null) {
            mValueAnimator = ValueAnimator.ofObject(new BezierEvaluator(new PointF(mControlX, mControlY)), new PointF(mStartX, mStartY), new PointF(mEndX, mEndY));
            mValueAnimator.setDuration(3000);
            mValueAnimator.setRepeatCount(ValueAnimator.INFINITE);
            mValueAnimator.setRepeatMode(ValueAnimator.RESTART);
            mValueAnimator.setInterpolator(new AccelerateInterpolator());
            mValueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator animation) {
                    PointF pointF = (PointF) animation.getAnimatedValue();
                    mFlagX = (int) pointF.x;
                    mFlagY = (int) pointF.y;
                    invalidate();
                }
            });
            mValueAnimator.start();
        } else if (!mValueAnimator.isPaused()) {
            mValueAnimator.pause();
        } else {
            mValueAnimator.resume();
        }
    }
}
```
### 实现效果：
<Common-Thumb :prefix="'/img/conclusion/android'" width="300" :urls="'shop-cart.gif'"/>
## 7、模拟水波纹特效
``` java
public class RippleView extends View implements View.OnClickListener {
    private int mScreenWidth;
    private int mScreenHeight;
    private int mRippleCount;
    private int mRippleLength = 300;

    private Path mPath;

    private Paint mPaint;

    private int mStartY;

    private ValueAnimator mValueAnimator;

    private float mOffset;

    public RippleView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        mScreenWidth = w;
        mScreenHeight = h;
        mRippleCount = (int) Math.round(mScreenWidth / mRippleLength + 1.5);
        mStartY = h / 2;
    }

    private void init() {
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setStrokeWidth(4);
        mPaint.setStyle(Paint.Style.FILL);
        mPaint.setColor(0x884444ff);
        mPath = new Path();

        setOnClickListener(this);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        mPath.reset();
        int quarterLength = mRippleLength / 4;
        int threeQuarterLength = mRippleLength / 4 * 3;
        int halfLength = mRippleLength / 2;
        mPath.moveTo(0, mStartY);
        for (int i = 0; i < mRippleCount; i++) {
            int temp = (int) ((i - 1 + mOffset) * mRippleLength);
            mPath.quadTo(temp + quarterLength, mStartY - 50, temp + halfLength, mStartY);
            mPath.quadTo(temp + threeQuarterLength, mStartY + 50, temp + mRippleLength, mStartY);
        }
        mPath.lineTo(mScreenWidth, mScreenHeight);
        mPath.lineTo(0, mScreenHeight);
        mPath.close();
        canvas.drawPath(mPath, mPaint);
    }


    @Override
    public void onClick(View v) {
        if (mValueAnimator == null) {
            mValueAnimator = ValueAnimator.ofFloat(0, 1);
            mValueAnimator.setInterpolator(new LinearInterpolator());
            mValueAnimator.setRepeatMode(ValueAnimator.RESTART);
            mValueAnimator.setRepeatCount(ValueAnimator.INFINITE);
            mValueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator animation) {
                    mOffset = (float) animation.getAnimatedValue();
                    invalidate();
                }
            });
            mValueAnimator.start();
        } else if (mValueAnimator.isPaused()) {
            mValueAnimator.resume();
        } else {
            mValueAnimator.pause();
        }

    }
}
```
### 实现效果：
<Common-Thumb :prefix="'/img/conclusion/android'" width="300" :urls="'ripple.gif'"/>