import React, { useState } from "react"
import { StaticQuery, graphql } from "gatsby"
import './style.css';


const WpApiPosts = () => (
  <StaticQuery
    query={graphql`
      query {
        wpJson {
          endpoints {
            args {
              after {
                description
              }
              author {
                description
              }
            }
          }
        }
      }
    `}
    render={data => {
      const args = data.wpJson.endpoints.args
      return(
        <>
        <table>
          <tr>
            <td> {args.after.description} </td>
          </tr>
          <tr>
            <td> {args.author.description} </td>
          </tr>
        </table>
        </>
      )
    }}
  />
)

export default WpApiPosts
