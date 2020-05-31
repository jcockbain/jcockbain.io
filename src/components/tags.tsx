import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import Badge from "react-bootstrap/badge"

interface Tag {
  tag: string
  totalCount: number
}

interface Props {
  updateCategories: (categories: string[]) => void
  currentCategories: string[]
}

const Tags = ({ updateCategories, currentCategories }: Props) => {
  const pageQuery = graphql`
    query {
      allMarkdownRemark {
        group(field: frontmatter___tags) {
          tag: fieldValue
          totalCount
        }
      }
    }
  `

  const modifyCategories = (selected: string) => () => {
    const newCategories = currentCategories.includes(selected)
      ? currentCategories.filter(cat => cat !== selected)
      : currentCategories.concat(currentCategories, selected)
    updateCategories(newCategories)
  }

  const data = useStaticQuery(pageQuery)
  const tags = data.allMarkdownRemark.group
  return (
    <div className="blog-tags-panel">
      {tags.map((element: Tag) => (
        <Badge
          onClick={modifyCategories(element.tag)}
          className={`tag-selector ${
            currentCategories.includes(element.tag) ? "active" : ""
          }`}
          key={element.tag}
        >
          {element.tag}
        </Badge>
      ))}
    </div>
  )
}

export default Tags
