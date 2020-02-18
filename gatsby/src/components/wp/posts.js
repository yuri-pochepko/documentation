import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx"

const WpApiPosts = ({ data }) => {
      return (
          <>
          <MDXProvider>
            <MDXRenderer>{data.wpJson.endpoints.args.after.description}</MDXRenderer>
          </MDXProvider>
          <hr />
            </>
      )
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        wpJson {
          endpoints {
            args {
              author {
                description
                required
                type
              }
              after {
                description
                required
                type
              }
            }
          }
        }
      }
    `}
    render={data => <WpApiPosts data={data} {...props} />}
  />
)
