import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft } from "lucide-react";
import { healthCheck, databaseTest, videoAPI } from "../utils/api";

interface DataTestComponentProps {
  onBack?: () => void;
}

export function DataTestComponent({ onBack }: DataTestComponentProps = {}) {
  const [healthStatus, setHealthStatus] = useState<string>("");
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [videosData, setVideosData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [databaseType, setDatabaseType] = useState<string>("");

  const testHealthCheck = async () => {
    try {
      setLoading(true);
      const result = await healthCheck();
      setHealthStatus(`✅ 서버 상태: ${result.status}`);
    } catch (error) {
      setHealthStatus(`❌ 서버 오류: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testDatabase = async () => {
    try {
      setLoading(true);
      const result = await databaseTest();
      setDbTestResult(result);
    } catch (error) {
      setDbTestResult({ error: `데이터베이스 테스트 실패: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const testVideoAPI = async () => {
    try {
      setLoading(true);
      const result = await videoAPI.getVideos(0, 5, 'trending');
      setVideosData(result);
      
      // 데이터베이스 타입 확인
      if (result.source === 'postgresql') {
        setDatabaseType("🐘 PostgreSQL (실제 관계형 데이터베이스!)");
      } else if (result.source === 'kv_store') {
        setDatabaseType("📦 KV Store (Fallback)");
      } else {
        setDatabaseType("❓ 알 수 없음");
      }
    } catch (error) {
      setVideosData({ error: `오류: ${error}` });
      setDatabaseType("❌ 데이터베이스 연결 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h2 className="text-xl font-bold">🔍 FoodieClips 데이터 테스트</h2>
          <p className="text-sm text-gray-600 mt-1">서버 연결과 데이터베이스 상태를 확인합니다</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button onClick={testHealthCheck} disabled={loading}>
          {loading ? "테스트 중..." : "서버 상태 확인"}
        </Button>
        {healthStatus && (
          <Card className="p-3">
            <p>{healthStatus}</p>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={testDatabase} disabled={loading} className="bg-purple-500 hover:bg-purple-600 text-white">
          {loading ? "테스트 중..." : "🔍 데이터베이스 연결 테스트"}
        </Button>
        {dbTestResult && (
          <Card className="p-3">
            <h3 className="font-bold mb-2">🗄️ 데이터베이스 상태:</h3>
            {dbTestResult.error ? (
              <p className="text-red-500">{dbTestResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">{dbTestResult.message}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded ${dbTestResult.postgresql.available ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="font-medium">PostgreSQL</div>
                    <div>{dbTestResult.postgresql.available ? '✅ 사용 가능' : '❌ 사용 불가'}</div>
                    {dbTestResult.postgresql.error && (
                      <div className="text-xs text-red-600 mt-1">{dbTestResult.postgresql.error}</div>
                    )}
                  </div>
                  <div className={`p-2 rounded ${dbTestResult.kv_store.available ? 'bg-green-100' : 'bg-red-100'}`}>
                    <div className="font-medium">KV Store</div>
                    <div>{dbTestResult.kv_store.available ? '✅ 사용 가능' : '❌ 사용 불가'}</div>
                    {dbTestResult.kv_store.error && (
                      <div className="text-xs text-red-600 mt-1">{dbTestResult.kv_store.error}</div>
                    )}
                  </div>
                </div>
                <div className="text-xs bg-blue-100 p-2 rounded">
                  <strong>현재 사용 중:</strong> {dbTestResult.data_source}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={testVideoAPI} disabled={loading}>
          {loading ? "로딩 중..." : "영상 데이터 테스트"}
        </Button>
        
        {databaseType && (
          <Card className="p-3">
            <h3 className="font-bold mb-2">📊 데이터베이스 타입:</h3>
            <p className="text-lg">{databaseType}</p>
          </Card>
        )}
        
        {videosData && (
          <Card className="p-3 max-h-96 overflow-auto">
            <h3 className="font-bold mb-2">영상 데이터:</h3>
            <div className="mb-2">
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                총 {videosData.totalCount}개 영상
              </span>
              {videosData.source && (
                <span className="text-xs bg-green-100 px-2 py-1 rounded ml-2">
                  Source: {videosData.source}
                </span>
              )}
            </div>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(videosData, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}