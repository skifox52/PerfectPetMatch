import React, { useState, useRef, useEffect } from "react"
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md"
import autoAnimate from "@formkit/auto-animate"

interface SingleReportProps {
  rep: { reason: string; detail: string }
  setReportData: React.Dispatch<React.SetStateAction<string>>
  reportData: string
}

export const SingleReport: React.FC<SingleReportProps> = ({
  rep,
  setReportData,
  reportData,
}) => {
  const [showDetail, setShowDetails] = useState<boolean>(false)
  const parentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    parentRef.current && autoAnimate(parentRef.current)
  }, [parentRef])

  return (
    <div className="flex items-start gap-3 w-full">
      <input
        type="radio"
        name="radio-2"
        className="radio radio-primary"
        value={rep.reason}
        checked={reportData === rep.reason}
        onChange={(e) => setReportData(e.target.value)}
      />
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm">{rep.reason}</p>
          {showDetail ? (
            <MdOutlineKeyboardArrowUp
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(false)
              }}
            />
          ) : (
            <MdOutlineKeyboardArrowDown
              className="hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
            />
          )}
        </div>
        <div ref={parentRef}>
          {showDetail && (
            <p className="p-2 mt-4 bg-primary bg-opacity-20 text-gray-700 rounded-lg border border-gray-200 text-justify ">
              {rep.detail}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
