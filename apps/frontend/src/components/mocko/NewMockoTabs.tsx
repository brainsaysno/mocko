import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewFixedMocko from './NewFixedMocko';
import NewAIProseMocko from './NewAIProseMocko';
import NewAIJsonMocko from './NewAIJsonMocko';
import { MockoType } from '@/model/mocko';

export default function NewMockoTabs({
  defaultType,
}: {
  defaultType?: MockoType;
}) {
  return (
    <Tabs
      defaultValue={
        !defaultType ||
          [MockoType.AIJson, MockoType.AIProse].includes(defaultType)
          ? 'ai'
          : defaultType
      }
      className="flex flex-col justify-center"
    >
      <TabsList
        className="md:w-1/2 grid w-full grid-cols-2 mx-auto"
        id="tour-mocko-type-tabs"
      >
        <TabsTrigger value="ai">AI</TabsTrigger>
        <TabsTrigger value={MockoType.Fixed}>Fixed</TabsTrigger>
      </TabsList>
      <TabsContent value="ai">
        <NewAIMocko defaultType={defaultType} />
      </TabsContent>
      <TabsContent value={MockoType.Fixed}>
        <NewFixedMocko />
      </TabsContent>
    </Tabs>
  );
}

function NewAIMocko({ defaultType }: { defaultType?: MockoType }) {
  return (
    <Tabs
      defaultValue={
        defaultType == MockoType.AIJson ? MockoType.AIJson : MockoType.AIProse
      }
      className="flex flex-col justify-center"
    >
      <TabsList className="md:w-1/2 grid w-full grid-cols-2 mx-auto">
        <TabsTrigger value={MockoType.AIProse}>Prose</TabsTrigger>
        <TabsTrigger value={MockoType.AIJson}>JSON</TabsTrigger>
      </TabsList>
      <TabsContent value={MockoType.AIProse}>
        <NewAIProseMocko />
      </TabsContent>
      <TabsContent value={MockoType.AIJson}>
        <NewAIJsonMocko />
      </TabsContent>
    </Tabs>
  );
}
