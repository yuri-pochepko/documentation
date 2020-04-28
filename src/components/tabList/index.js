import React, { useState, useEffect } from "react"
import Tab from "../tab"
import "./style.css"

const TabList = ({ children }) => {
  var cmsProp  = "Drupal 7"// To be set by another component, yet to be created
  //console.log("cmsProp: ", cmsProp) // For Debugging
  const [activeTab, setActiveTab] = useState(null)
  const [initialized, setInitialized] = useState(null)
  const [selectedCms, selectCms] = useState(cmsProp ? cmsProp : null)
  //console.log("selectedCms: ", selectedCms) // For Debugging
  //console.log("selectedCms.substring(0, 6): ", selectedCms.substring(0, 6)) // For Debugging

  const [isCmsTabs, setIsCmsTabs] = useState(false)

  useEffect(() => {
    if (!initialized) {
      // determine which tab is initially active
      console.log("isCmsTabs? ", isCmsTabs) // For Debugging
      //debugger
      const initialActiveTab = isCmsTabs && selectedCms
        ?
        children.find(
            tab => {
              console.log("tab.props.title.toLowerCase(): ", tab.props.title.toLowerCase())
              console.log("selectedCms.toLowerCase(): ", selectedCms.toLowerCase())
              tab.props.title.toLowerCase() == selectedCms.toLowerCase()
              }
          ) ^
          children.find(tab => {
            console.log("tab.props.title.toLowerCase(): ", tab.props.title.toLowerCase())
              console.log("selectedCms.toLowerCase().substring(0, 6): ", selectedCms.toLowerCase().substring(0, 6))
            tab.props.title.toLowerCase().includes(selectedCms.toLowerCase().substring(0, 6))
          }
          )
        : children.find(tab => tab.props.active === true)
      console.log("initialActiveTab: ", initialActiveTab) // For Debugging
      initialActiveTab && setActiveTab(initialActiveTab.props.id)
      //setInitialized(true)
    }
  }, [isCmsTabs])

  useEffect(() => {
    const cmses = ["drupal", "wordpress"]

    const titles = children.map(tab => tab.props.title)
    //console.log("titles array: ", titles) // For Debugging

    function findCommonElement(array1, array2) {
      return array1.some(item =>
        array2.includes(item.toLowerCase().substring(0, 6))
      )
      //      // Loop for array1
      //      for (let i = 0; i < array1.length; i++) {
      //        // Loop for array2
      //        for (let j = 0; j < array2.length; j++) {
      //          // Compare the element of each and
      //          // every element from both of the
      //          // arrays
      //          if (array2[j].toLowerCase().indexOf(array1[i]) > -1) {
      //            // Return if common element found
      //            return true
      //          }
      //        }
      //      }
      //      // Return if no common element exist
      //      return false
    }

    if (titles.length) {
      const hasIntersection = findCommonElement(titles, cmses)
      //console.log("value of hasIntersection: ", hasIntersection) // For debugging
      setIsCmsTabs(hasIntersection)
      //console.log("just ran setIsCmsTabs, value: ", isCmsTabs) // For Debugging
    } else {
      setIsCmsTabs(false)
    }
  }, [children])

  const renderTab = tab => {
    //console.log("tab.props.title in renterTab: ", tab.props.title) //For Debugging
    let elementId = tab.props.id
      .trim()
      .replace(" ", "-")
      .toLowerCase()

    let elementClass =
      elementId === activeTab || tab.props.active & (activeTab === "")
        ? "active"
        : ""

    return (
      <li
        key={`tab-${elementId}`}
        id={`${elementId}-id`}
        role="presentation"
        className={elementClass}
      >
        <a
          href={`#${elementId}`}
          aria-controls={elementId}
          role="tab"
          data-toggle="tab"
          onClick={() => setActiveTab(elementId)}
        >
          {tab.props.title}
        </a>
      </li>
    )
  }

  const renderTabContent = tab => {
    let elementId = tab.props.id
      .trim()
      .replace(" ", "-")
      .toLowerCase()

    return (
      <Tab
        key={`tab-content-${elementId}`}
        title={tab.props.title}
        active={elementId === activeTab}
      >
        {tab.props.children}
      </Tab>
    )
  }

  return (
    <>
      <ul className="nav nav-tabs" role="tablist">
        {isCmsTabs && selectedCms
          ? children
              .filter(tab => {
                ///console.log("tab.props.title.includes(selectedCms: )", tab.props.title.includes(selectedCms.substring(0,6))) // For debugging
                return tab.props.title.toLowerCase().indexOf(selectedCms.toLowerCase().substring(0, 6)) >= 0
              })
              .map(tab => renderTab(tab))
          : children.map(tab => renderTab(tab))}
      </ul>
      <div className="tab-content">
        {children.map(tab => renderTabContent(tab))}
      </div>
    </>
  )
}

export default TabList
