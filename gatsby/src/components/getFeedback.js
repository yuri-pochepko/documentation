import React from "react"
import { fetch } from "node-fetch"

const GetFeedBack = ({ formId, page, topic }) => {

//const FeedbackContents = async ()  => {
//  const response = await fetch(`https://www.getfeedback.com/e/${formId}?page=${page}&topic=${topic}`)
//  return response
//}

  return (
    <iframe
      title="GetFeedBack"
      style={{ border: "0", minHeight: "300px", minWidth: "500px", overflow: "hidden" }}
      frameBorder="0"
      scrolling="no"
      src={`https://www.getfeedback.com/e/${formId}?page=${page}&topic=${topic}`}
    />
    //<div className="toc-ignore" dangerouslySetInnerHTML={{__html: FeedbackContents}} />

  )
}

export default GetFeedBack
