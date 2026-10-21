import { useState, type ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'

import { colors, fonts, radius, shadow, space } from '@/theme'

import { Text } from './ui'

/** The web app's logo mark (assets/logo-mark.svg): an "A" in a soft square */
export function LogoMark({ size = 40, color = colors.cream }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 62.4014 62.4014" accessibilityLabel="Rent A View">
      <Path
        fill={color}
        d="M38.4014 0C51.656 0 62.4011 10.7444 62.4014 23.999V38.4014C62.4011 51.656 51.656 62.4014 38.4014 62.4014H24C10.7453 62.4014 0.000263885 51.656 0 38.4014V23.999C0.000263885 10.7444 10.7453 0 24 0H38.4014ZM21.4424 33.7949C15.014 32.9404 10.8154 31.5645 10.8154 31.5645V37.459C10.8154 37.459 14.3126 38.4537 19.6357 39.2148L17.7783 44.79H24.9844L26.3496 39.9102C27.9052 40.0084 29.5303 40.0674 31.2012 40.0674C32.8872 40.0674 34.5234 40.0071 36.0869 39.9072L37.4629 44.79H44.5869L42.7197 39.2158C48.0079 38.4546 51.458 37.459 51.458 37.459L51.5859 31.5645C51.5585 31.5736 47.3718 32.9687 40.9131 33.8184L35.4863 17.6104H26.8379L21.4424 33.7949ZM34.5312 34.3838C33.481 34.4313 32.3987 34.459 31.2891 34.459C30.1285 34.459 28.996 34.4277 27.8975 34.376L31.0801 23.0049H31.3271L34.5312 34.3838Z"
      />
    </Svg>
  )
}

/** The full RentaView logotype (client file, 981×136). Height sets the size. */
export function Logotype({ height = 22, color = colors.ink }: { height?: number; color?: string }) {
  return (
    <Svg width={(height * 981) / 136} height={height} viewBox="0 0 981 136" accessibilityLabel="RentaView">
      <Path
        fill={color}
        d="M151.726 32.7617C160.116 32.7617 167.273 34.2418 173.195 37.2031C179.241 40.0409 184.053 44.0514 187.631 49.2334C191.209 54.4156 193.492 60.4003 194.479 67.1865C195.59 73.9727 195.466 81.3143 194.108 89.2109L133.582 90.1582C134.094 97.4248 135.7 102.908 138.4 106.608C141.732 111.174 146.852 113.456 153.762 113.456C156.723 113.456 159.191 113.086 161.165 112.346C163.139 111.605 164.743 110.556 165.977 109.199C167.21 107.719 168.075 105.992 168.568 104.018C169.062 101.92 169.246 99.5754 169.123 96.9844L196.515 98.4648C196.885 102.536 196.453 106.731 195.22 111.05C194.109 115.368 191.949 119.378 188.741 123.08C185.533 126.782 181.03 129.805 175.23 132.149C169.555 134.494 162.336 135.666 153.576 135.666C144.323 135.666 136.549 134.37 130.257 131.779C124.088 129.065 119.09 125.425 115.265 120.859C111.44 116.171 108.664 110.865 106.937 104.942C105.333 99.02 104.53 92.7893 104.53 86.25C104.53 79.2171 105.394 72.4922 107.121 66.0762C108.972 59.6601 111.749 53.9843 115.45 49.0488C119.275 43.99 124.149 40.041 130.071 37.2031C136.117 34.2419 143.335 32.7617 151.726 32.7617ZM791.662 32.7617C800.052 32.7618 807.208 34.242 813.131 37.2031C819.177 40.041 823.989 44.0512 827.567 49.2334C831.146 54.4156 833.428 60.4003 834.415 67.1865C835.526 73.9727 835.402 81.3142 834.045 89.2109L773.519 90.1582C774.03 97.4248 775.636 102.908 778.336 106.608C781.667 111.174 786.788 113.456 793.697 113.456C796.659 113.456 799.126 113.086 801.101 112.346C803.075 111.605 804.679 110.556 805.913 109.199C807.147 107.719 808.01 105.991 808.504 104.018C808.997 101.92 809.183 99.5754 809.06 96.9844L836.451 98.4648C836.821 102.536 836.389 106.731 835.155 111.05C834.045 115.368 831.886 119.379 828.678 123.08C825.47 126.782 820.966 129.805 815.167 132.149C809.491 134.494 802.273 135.666 793.513 135.666C784.259 135.666 776.485 134.37 770.192 131.779C764.023 129.065 759.026 125.425 755.201 120.859C751.376 116.171 748.599 110.865 746.872 104.942C745.268 99.0201 744.467 92.7892 744.467 86.25C744.467 79.217 745.33 72.4922 747.058 66.0762C748.908 59.6602 751.684 53.9842 755.386 49.0488C759.211 43.99 764.085 40.041 770.008 37.2031C776.054 34.242 783.272 32.7617 791.662 32.7617ZM341.71 35.3516H364.104V59.4111H341.71V96.4277C341.71 101.116 342.82 104.448 345.041 106.422C347.385 108.396 350.223 109.383 353.555 109.383C355.282 109.383 357.072 109.136 358.923 108.643C360.773 108.149 362.501 107.47 364.104 106.606V132.703C360.28 133.814 356.886 134.492 353.925 134.739C350.964 135.109 348.373 135.294 346.152 135.294C334.678 135.294 326.102 132.395 320.426 126.596C314.873 120.673 312.098 111.542 312.098 99.2031V58.6709H301.362V39.793H301.918C309.568 38.8059 314.997 36.2768 318.205 32.2051C321.413 28.01 323.387 21.7172 324.127 13.3271V12.9561H341.71V35.3516ZM264.619 32.7617C275.23 32.7617 283.19 36.2785 288.495 43.3115C293.924 50.3445 296.639 60.8321 296.639 74.7744V133.075H266.655V78.6611C266.655 71.9984 265.606 67.0013 263.509 63.6699C261.535 60.3386 258.327 58.6729 253.885 58.6729C250.183 58.6729 246.914 59.9686 244.076 62.5596C241.238 65.1506 239.017 69.3456 237.413 75.1445C235.809 80.9437 235.007 88.7173 235.007 98.4648V133.075H205.023V35.3525H230.38V75.1445H231.86C232.601 65.5207 234.205 57.6243 236.673 51.4551C239.141 45.1625 242.657 40.4733 247.222 37.3887C251.787 34.3041 257.586 32.7618 264.619 32.7617ZM50.7119 10.9209C56.1408 10.9209 61.2613 11.4143 66.0732 12.4014C71.0087 13.2651 75.451 14.6228 79.3994 16.4736C83.471 18.3244 86.988 20.668 89.9492 23.5059C92.9105 26.3437 95.1929 29.7372 96.7969 33.6855C98.4009 37.5105 99.2031 41.8908 99.2031 46.8262C99.2031 50.6511 98.5242 54.2913 97.167 57.7461C95.9332 61.0773 93.8972 64.1001 91.0596 66.8145C88.3451 69.5289 84.7661 71.8123 80.3242 73.6631C76.0059 75.3904 70.8239 76.624 64.7783 77.3643V78.8447C72.6747 79.2149 78.7822 80.7573 83.1006 83.4717C87.4191 86.1862 90.627 89.6418 92.7246 93.8369C94.9455 97.9086 96.6112 102.35 97.7217 107.162L104.2 133.073H71.0703L66.4434 108.828C65.703 104.633 64.5308 101.24 62.9268 98.6484C61.4461 96.0574 59.287 94.145 56.4492 92.9111C53.6113 91.6773 49.8478 91.0605 45.1592 91.0605H29.9834V133.073H0V10.9209H50.7119ZM642.271 108.272H642.825L667.441 10.9209H700.016L661.519 133.073H623.022L584.525 10.9209H617.1L642.271 108.272ZM879.123 107.902H880.049L892.634 35.3506H925.763L937.979 107.902H938.903L951.119 35.3506H980.917L958.152 133.073H919.1L909.105 67.1846H908.181L897.816 133.073H859.135L835.999 35.3506H867.833L879.123 107.902ZM735.51 133.072H705.526V35.3506H735.51V133.072ZM522.44 78.208C552.334 74.3907 571.979 67.9463 571.979 67.9463V94.4414C571.979 94.4414 555.485 99.1406 530.566 102.589L540.688 132.953H508.3L500.538 105.561C494.044 105.942 487.292 106.164 480.363 106.164C473.37 106.164 466.568 105.938 460.037 105.551L452.221 132.953H420.202L430.367 102.593C405.602 99.1442 389.324 94.4414 389.324 94.4414L388.748 67.9463C388.799 67.9633 408.402 74.5158 438.497 78.3135L461.104 10.7998H499.972L522.44 78.208ZM467.128 80.6953C471.304 80.8621 475.588 80.9561 479.968 80.9561C484.578 80.9561 489.09 80.8519 493.484 80.668L480.908 36.2822H479.798L467.128 80.6953ZM151.726 56.2666C147.16 56.2666 143.52 57.4389 140.806 59.7832C138.091 62.1275 136.179 65.459 135.068 69.7773C134.731 71.0513 134.446 72.3994 134.211 73.8213L167.659 73.1768C167.536 71.4104 167.286 69.7836 166.902 68.2969C166.039 64.3486 164.373 61.3873 161.905 59.4131C159.438 57.3155 156.044 56.2666 151.726 56.2666ZM791.662 56.2666C787.097 56.2666 783.457 57.4389 780.742 59.7832C778.028 62.1275 776.115 65.459 775.005 69.7773C774.668 71.0513 774.381 72.3994 774.146 73.8213L807.595 73.1768C807.472 71.4104 807.222 69.7836 806.838 68.2969C805.974 64.3486 804.309 61.3873 801.841 59.4131C799.373 57.3157 795.98 56.2667 791.662 56.2666ZM29.9834 67.9258H47.3809C54.1666 67.9257 59.3486 66.6299 62.9268 64.0391C66.505 61.4479 68.2939 57.499 68.2939 52.1934C68.2939 46.3943 66.6283 42.0761 63.2969 39.2383C59.9655 36.4005 54.9071 34.9815 48.1211 34.9814H29.9834V67.9258ZM720.333 0C726.132 5.14025e-06 730.512 1.23356 733.474 3.70117C736.558 6.16888 738.101 9.68575 738.101 14.251C738.101 18.6928 736.558 22.1475 733.474 24.6152C730.512 27.083 726.132 28.3174 720.333 28.3174C714.657 28.3174 710.277 27.1451 707.192 24.8008C704.231 22.3331 702.75 18.8163 702.75 14.251C702.75 9.56237 704.231 6.04549 707.192 3.70117C710.277 1.23357 714.657 0 720.333 0Z"
      />
    </Svg>
  )
}

/** White input, hairline border, 12px radius, 48 tall. Ink border on focus. */
export function TextField({
  label,
  multiline,
  style,
  ...props
}: TextInputProps & { label: string; style?: StyleProp<ViewStyle> }) {
  const [focused, setFocused] = useState(false)
  return (
    <View style={[{ gap: space.sm }, style]}>
      <Text variant="label">{label}</Text>
      <TextInput
        placeholderTextColor={colors.mutedSoft}
        selectionColor={colors.ink}
        cursorColor={colors.ink}
        multiline={multiline}
        {...props}
        onFocus={(e) => {
          setFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          props.onBlur?.(e)
        }}
        style={{
          backgroundColor: colors.canvas,
          borderColor: focused ? colors.ink : colors.hairline,
          borderRadius: radius.sm,
          borderWidth: focused ? 2 : 1,
          color: colors.ink,
          fontFamily: fonts.sans,
          fontSize: 16,
          minHeight: multiline ? 112 : 48,
          paddingHorizontal: focused ? 13 : 14,
          paddingTop: multiline ? 12 : 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  )
}

/** Floating white sheet from the bottom, over a scrim */
export function Sheet({
  visible,
  onClose,
  children,
  dismissable = true,
}: {
  visible: boolean
  onClose: () => void
  children: ReactNode
  dismissable?: boolean
}) {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          accessibilityLabel="Close"
          onPress={dismissable ? onClose : undefined}
          style={{ backgroundColor: colors.scrim, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
        />
        <View
          style={[
            {
              backgroundColor: colors.canvas,
              borderRadius: radius.lg,
              gap: space.base,
              margin: space.sm,
              marginBottom: Math.max(insets.bottom, space.sm),
              padding: space.lg,
            },
            shadow,
          ]}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

/** Sticky bottom action bar, Airbnb reservation style */
export function ActionBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        {
          backgroundColor: colors.page,
          borderTopColor: colors.hairlineSoft,
          borderTopWidth: 1,
          gap: space.md,
          paddingBottom: Math.max(insets.bottom, space.base),
          paddingHorizontal: 20,
          paddingTop: space.md,
        },
        style,
      ]}>
      {children}
    </View>
  )
}

export function Section({
  title,
  children,
  action,
  style,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View style={[{ gap: space.md }, style]}>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="section">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  )
}

/** Screen title block: serif headline with an optional italic lead */
export function ScreenTitle({ title, lead, kicker }: { title: string; lead?: string; kicker?: ReactNode }) {
  return (
    <View style={{ gap: space.sm }}>
      {kicker}
      <Text variant="display">{title}</Text>
      {lead && <Text variant="lead">{lead}</Text>}
    </View>
  )
}
