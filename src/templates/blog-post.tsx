import { graphql, PageRendererProps } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import styled from "styled-components"
import PostNavigator from "../components/postNavigator"
import { Layout } from "../containers/layout"
import Card from "../elements/card"
import Flex from "../elements/flex"
import { SEO } from "../elements/seo"
import BlogTag from "../elements/tag"
import { Query, SitePageContext } from "../graphql-types"

interface Props extends PageRendererProps {
  pageContext: SitePageContext
  data: Query
}

const Date = styled.p`
  margin: 0.5rem 0;
`
const BlogContent = styled.div`
  margin-top: 1rem;

  blockquote {
    padding: 20px;
    margin: 20px 0;
    border: 1.5px solid ${props => props.theme.formBorder};
    border-radius: 3px;

    border-left: 4px solid ${props => props.theme.calloutBorder};
    background-color: ${props => props.theme.surface};
  }

  blockquote h4 {
    margin-top: 0;
    margin-bottom: 5px;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }

  blockquote code {
    border-radius: 3px;
  }

  blockquote + blockquote {
    margin-top: -5px;
  }

  .filename {
    background: black;
    padding: 0.5rem 1rem 0.75rem;
    font-size: 0.8rem;
    color: white;
    opacity: ${props => props.theme.headerOpacity};
    font-weight: bold;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin-bottom: -0.8rem;
  }
`

const BlogPostTemplate = (props: Props) => {
  const data = props.data!
  const post = data.markdownRemark!
  const excerpt = post.excerpt!
  const frontmatter = post.frontmatter!
  const html = post.html!
  const timeToRead = post.timeToRead
  const { previous, next } = props.pageContext

  return (
    <Layout location={props.location} title={post.frontmatter!.title}>
      <SEO
        title={frontmatter.title!}
        description={frontmatter.description || excerpt}
      />
      <Card>
        <Date>
          {`${frontmatter.date} `} &bull;
          {` ${timeToRead} min read`}
        </Date>
        <Flex>
          {frontmatter!.tags!.map((tag: string) => (
            <BlogTag key={tag} text={tag} />
          ))}
        </Flex>
        {post.frontmatter!.featuredImage && (
          <Img
            fluid={post.frontmatter!.featuredImage!.childImageSharp!.fluid}
          />
        )}
        <BlogContent dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
      <PostNavigator next={next} previous={previous} />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
