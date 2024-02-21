# Known Issues

## Android

### Indicator does not move during scrolling

<img src="./images/indicator-not-moving.gif" alt="Indicator not moving" height="70" />

The solution I found for now:

```tsx
<Tabs {...props} forceUpdateScrollAmountValue={true} />
```

Sometimes when the scroll event is triggered, the animation value is not updated and as a result the indicator does not move with the scrollable area. We can solve this problem with `{ useNativeDriver: false }`, but this time the animations start to stutter.
