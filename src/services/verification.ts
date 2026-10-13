// Tour guide licence upload. Prototype: the file is picked but never sent, and
// it goes straight to "in review".
// Production: upload to storage, then a manual or automated check sets the
// licence to verified and the traveller app shows the badge.
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

import { now } from '@/lib/time'
import type { GuideLicence } from '@/types'

export type LicenceSource = 'photo' | 'file'

export async function pickLicence(source: LicenceSource): Promise<GuideLicence | null> {
  let fileName: string | null | undefined
  if (source === 'photo') {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 })
    if (result.canceled) return null
    fileName = result.assets[0].fileName
  } else {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: false,
    })
    if (result.canceled) return null
    fileName = result.assets[0].name
  }
  return { status: 'pending', fileName: fileName ?? 'Licence photo', submittedAt: now() }
}
