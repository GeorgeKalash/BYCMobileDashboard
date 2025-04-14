import React, { useEffect, useState } from 'react'
import CommonCardHeader from "@/CommonComponent/CommonCardHeader"
import { SampleCard } from "@/Constant"
import { SamplePageData } from "@/Data/Pages"
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { getRequest } from '@/Redux/Reducers/RequestThunks'
import { useAppDispatch } from '@/Redux/Hooks'
import { withRequestTracking } from '@/utils/withRequestTracking '

interface DocumentType {
  id: number
  name: string
}

const SamplePageContainer = () => {
  const dispatch = useAppDispatch()
  const [docType, setDocType] = useState<DocumentType | null>(null)
  const [error, setError] = useState<string>('')

  const fetchDocumentType = async () => {
    try {
      const result = await withRequestTracking(dispatch, () =>
        dispatch(getRequest({
          extension: 'BP.asmx/pageGRP',
          parameters: '_startAt=0&_pageSize=50&filter='
        }))
      )

      console.log(result)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch document type')
    }
  }

  useEffect(() => {
    fetchDocumentType()
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CommonCardHeader title={SampleCard} span={SamplePageData} />
            <CardBody>
              {error && <div className="text-danger mb-2">{error}</div>}
              <p>
                "Sample-page" is a generic term used to refer to a basic, placeholder, or example page that developers or designers use as a starting point for building or testing a website or application. It is not an official or standard term but rather a descriptive name commonly used in web development and design contexts. A sample page typically contains basic elements like headings, paragraphs, images, buttons, and links. It may also include placeholder text or images to represent content that will be replaced with actual content in the final version.
              </p>
              {docType && (
                <div className="mt-3">
                  <strong>Doc Type:</strong> {docType.name} (ID: {docType.id})
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SamplePageContainer
