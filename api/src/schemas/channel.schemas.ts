/**
 * Channel schemas.
 */

// External imports.
import { object, string } from "superstruct"

export const ApplyReservationSchema = object({
  reservationId: string(),
})
