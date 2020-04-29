import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import Helmet from "react-helmet"
import Layout from "../layout/layout"
import CallToAction from "../layout/call-to-action"
import TopicGroup from "../layout/topic-group"
import SubTopicGroup from "../layout/subtopic-group"
import Youtube from "../components/youtube"
import GuideItem from "../layout/guide-item"
import IntegrationGuideItem from "../layout/integration-guide-item"
import SEO from "../layout/seo"

class GetStarted extends React.Component {
  render() {
    const {
      data: { allMdx },
    } = this.props
    //console.log("allMdx.nodes: ", allMdx.nodes)
    return (
      <Layout>
        <SEO
          title="Get Started"
          image={"/assets/images/default-thumb-doc.png"}
        />
        <div className="container doc-content-well">
          <h1 className="title">Get Started</h1>
          <section className="row">
            <div className="col-md-6 hero-video__video">
              <Youtube src="qHHWonKfGsQ" title="Get Started" />
            </div>
            <div className="col-md-6">
              <CallToAction
                title="Get Started"
                type="Guide"
                subTitle="New to our platform? Check out our step-by-step guide to learn all the basics."
                url="/guides/quickstart"
              />
              <CallToAction
                title="Live Demo"
                type="Demo"
                subTitle="See how you can build amazing digital experiences on the fastest and most reliable WebOps platform."
                url="https://pantheon.io/live-demo?docs"
                dark
              />
            </div>
          </section>

          <SubTopicGroup
            title="Migrate your Sites to Pantheon"
            subTitle="Import existing sites using our guided migration tool, or migrate manually to preserve existing commit history."
            topics={[
              "Guided Migrations",
              "Manual Migrations",
              "Create Archives for Manual Migration",
            ]}
            docs={allMdx.nodes.filter(page => {
              return page.frontmatter.tags.includes(
                "migratemanual",
                "migrateguided"
              )
            })}
          />
          <TopicGroup
            title="TopicGroup1"
            subtitle="SubTitle"
            docs={allMdx.nodes.filter(page => {
              return page.frontmatter.tags.includes(
                "migratemanual",
                "migrateguided"
              )
            })}
          />

          {/*topic.topics_groups &&
                topic.topics_groups.map((group, key) => (
                  <React.Fragment>
                    <TopicGroup
                      key={group.title}
                      title={group.title}
                      subTitle={group.subtitle}
                      docs={group.links}
                    />
                    {(key + 1) % 2 === 0 ? <hr /> : null}
                  </React.Fragment>
                ))*/}
        </div>
      </Layout>
    )
  }
}

export default GetStarted
export const pageQuery = graphql`
  {
    allMdx(filter: { frontmatter: { category: { eq: "get-started" } } }) {
      nodes {
        frontmatter {
          category
          tags
          title
          type
        }
        fields {
          slug
        }
      }
    }
  }
`
