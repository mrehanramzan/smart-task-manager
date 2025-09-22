from fastapi import HTTPException
from mcp import ClientSession
from mcp.client.sse import sse_client
import json

from config.api import settings

async def call_mcp_tool(tool_name: str, params: dict):
    """Call a tool on the MCP server via SSE"""
    try:
        async with sse_client(url= settings.MCP_SERVER_URL) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                result = await session.call_tool(name=tool_name, arguments=params)

                if result.content and len(result.content) > 0:
                    # If the tool returns structured JSON, try parsing
                    text = result.content[0].text
                    try:
                        return json.loads(text)
                    except Exception:
                        return text
                return None
    except Exception as e:
        raise HTTPException(500, f"MCP tool call failed: {str(e)}")
