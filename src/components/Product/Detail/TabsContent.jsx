import TabContent from './TabContent';

const TabsContent = ({product}) => {
  return (
    <div className="tab-content" id="pills-tabContent">
      
      
      <TabContent product={product} id="faq1" isActive />
    </div>
  )
}

export default TabsContent