import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import "./style.css"

const propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  topics: PropTypes.array,
}

function SubtopicGroup(props) {
  const { title, subTitle, topics, docs } = props
  return (
    <section className="subtopic-container row">
      <h3>{title}</h3>
      {subTitle && <p className="topic-info__description">{subTitle}</p>}

      <div className="row">
        <div className="col-md-12">
          {console.log("Topics: ", topics)}
          {topics &&
            topics.map(topic => (
              <div key={topic} className="subtopic-lists col-md-6">
                {topic && <h4>{topic}</h4>}
                <ul className="topic-docs">
                  {console.log("docs: ", docs)}
                  {docs &&
                    docs.map(link => (
                      <li key={link.fields.slug}>
                        <Link to={link.fields.slug}>
                          {link.icon && <i className={link.icon} />}{" "}
                          {link.frontmatter.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

SubtopicGroup.propTypes = propTypes

export default SubtopicGroup
